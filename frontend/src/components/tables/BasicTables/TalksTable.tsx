import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import axiosInstance from "../../../utils/axiosInstance";
import EditTalk from "../../form/form-elements/EditTalk";
import ScheduleTalk from "../../form/form-elements/ScheduleTalk";
import { useEffect, useState } from "react";
import { Talk } from "../../../types/talks";
import { Room } from "../../../types/rooms";

export default function TalksTable() {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedTalk, setSelectedTalk] = useState<Talk | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Pour la modale planification
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<number | "">("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedHeure, setSelectedHeure] = useState<string>("");

  const fetchTalks = async () => {
    try {
      const res = await axiosInstance.get("/talks/");
      setTalks(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des talks :", error);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await axiosInstance.get("/rooms");
      setRooms(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des rooms :", error);
    }
  };

  useEffect(() => {
    fetchTalks();
    fetchRooms();
  }, []);

  const openModal = (talk: Talk) => {
    setSelectedTalk(talk);
    setNewStatus(talk.statut);
    setErrorMessage("");
  };

  const closeModal = () => {
    setSelectedTalk(null);
    setNewStatus("");
    setErrorMessage("");
  };

  // Modale planification
  const openScheduleModal = (talk: Talk) => {
    setSelectedTalk(talk);
    setSelectedRoom("");
    setSelectedDate("");
    setSelectedHeure("");
    setErrorMessage("");
    setShowScheduleModal(true);
  };

  const closeScheduleModal = () => {
    setSelectedTalk(null);
    setSelectedRoom("");
    setSelectedDate("");
    setSelectedHeure("");
    setErrorMessage("");
    setShowScheduleModal(false);
  };

  const handleStatusUpdate = async () => {
    if (!selectedTalk) return;

    try {
      await axiosInstance.patch(`/talks/${selectedTalk.id_talk}/status`, {
        status: newStatus,
      });
      await fetchTalks();
      closeModal();
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 404) {
        setErrorMessage("Le talk n'a pas été trouvé.");
      } else if (status === 403) {
        setErrorMessage("Vous n'avez pas les droits pour modifier ce talk.");
      } else if (status === 400) {
        setErrorMessage("Le talk ne peut plus être modifié.");
      } else {
        setErrorMessage("Une erreur inattendue est survenue.");
      }
    }
  };

  const handleScheduleSubmit = async () => {
    if (!selectedTalk) return;
    if (!selectedRoom || !selectedDate || !selectedHeure) {
      setErrorMessage("Veuillez remplir tous les champs de planification.");
      return;
    }

    try {
      await axiosInstance.patch(
        `/talks/${selectedTalk.id_talk}/schedule`,
        null,
        {
          params: {
            id_room: selectedRoom,
            date: selectedDate,
            heure: selectedHeure,
          },
        }
      );
      await fetchTalks();
      closeScheduleModal();
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 409) {
        setErrorMessage("Conflit : room ou créneau déjà pris.");
      } else if (status === 403) {
        setErrorMessage("Vous n'avez pas les droits pour planifier ce talk.");
      } else if (status === 404) {
        setErrorMessage("Le talk n'a pas été trouvé.");
      } else if (status === 400) {
        // Essayer d'afficher le message d'erreur précis envoyé par le backend
        const detail = error?.response?.data?.detail;
        setErrorMessage(detail || "Données de planification invalides.");
      } else {
        setErrorMessage("Erreur lors de la planification.");
      }
      console.error(error);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400"
              >
                Titre
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400"
              >
                Sujet
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400"
              >
                Conférencier
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400"
              >
                Durée
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400"
              >
                Niveau
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400"
              >
                Statut
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400"
              >
                Action
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400"
              >
                Planifier
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {talks.map((talk) => (
              <TableRow key={talk.id_talk}>
                <TableCell className="px-5 py-4 text-start">
                  {talk.titre}
                </TableCell>
                <TableCell className="px-5 py-4 text-start">
                  {talk.sujet}
                </TableCell>
                <TableCell className="px-5 py-4 text-start">
                  {talk.user ? (
                    <div>
                      <span className="block font-medium text-gray-800 dark:text-white/90">
                        {talk.user.nom}
                      </span>
                      <span className="block text-gray-500 dark:text-gray-400">
                        {talk.user.email}
                      </span>
                    </div>
                  ) : (
                    <span className="italic text-gray-400">
                      Utilisateur non renseigné
                    </span>
                  )}
                </TableCell>
                <TableCell className="px-5 py-4 text-start">
                  {talk.duree} min
                </TableCell>
                <TableCell className="px-5 py-4 text-start">
                  <Badge size="sm" color="info">
                    {talk.niveau}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-4 text-start">
                  <Badge
                    size="sm"
                    color={
                      talk.statut === "ACCEPTE"
                        ? "success"
                        : talk.statut === "EN_ATTENTE"
                          ? "warning"
                          : talk.statut === "PLANIFIE"
                            ? "info"
                            : "error"
                    }
                  >
                    {talk.statut}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-4 text-start">
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => openModal(talk)}
                  >
                    Modifier
                  </button>
                </TableCell>
                <TableCell className="px-5 py-4 text-start">
                  {talk.statut === "ACCEPTE" && (
                    <button
                      className="text-green-600 hover:underline text-sm"
                      onClick={() => openScheduleModal(talk)}
                    >
                      Planifier
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal pour modification de statut */}
      {selectedTalk && !showScheduleModal && (
        <EditTalk
          talk={selectedTalk}
          initialStatus={newStatus}
          onClose={closeModal}
          onStatusUpdate={async (status: string) => {
            await axiosInstance.patch(`/talks/${selectedTalk.id_talk}/status`, {
              status,
            });
            await fetchTalks();
            closeModal();
          }}
        />
      )}
      {/* Modal Planification */}
      {showScheduleModal && selectedTalk && (
        <ScheduleTalk
          rooms={rooms}
          onClose={closeScheduleModal}
          onSubmit={handleScheduleSubmit}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
}

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import axiosInstance from "../../../utils/axiosInstance";
import { useEffect, useState } from "react";

interface Conferencier {
  nom: string;
  email: string;
  id_utilisateur: number;
  id_role: number;
}

interface Talk {
  id_talk: number;
  titre: string;
  sujet: string;
  description: string;
  duree: number;
  niveau: "DEBUTANT" | "INTERMEDIAIRE" | "AVANCE";
  statut: "EN_ATTENTE" | "ACCEPTE" | "REFUSE" | "PLANIFIE";
  id_conferencier: number;
  conferencier: Conferencier;
  date: string;
  heure: string;
}

interface Salle {
  id_salle: number;
  nom_salle: string;
}

export default function TalksTable() {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [salles, setSalles] = useState<Salle[]>([]);
  const [selectedTalk, setSelectedTalk] = useState<Talk | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Pour la modale planification
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedSalle, setSelectedSalle] = useState<number | "">("");
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

  const fetchSalles = async () => {
    try {
      const res = await axiosInstance.get("/salles");
      setSalles(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des salles :", error);
    }
  };

  useEffect(() => {
    fetchTalks();
    fetchSalles();
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
    setSelectedSalle("");
    setSelectedDate("");
    setSelectedHeure("");
    setErrorMessage("");
    setShowScheduleModal(true);
  };

  const closeScheduleModal = () => {
    setSelectedTalk(null);
    setSelectedSalle("");
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
    if (!selectedSalle || !selectedDate || !selectedHeure) {
      setErrorMessage("Veuillez remplir tous les champs de planification.");
      return;
    }

    try {
      await axiosInstance.patch(
        `/talks/${selectedTalk.id_talk}/schedule`,
        null,
        {
          params: {
            id_salle: selectedSalle,
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
        setErrorMessage("Conflit : salle ou créneau déjà pris.");
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
                  <div>
                    <span className="block font-medium text-gray-800 dark:text-white/90">
                      {talk.conferencier.nom}
                    </span>
                    <span className="block text-gray-500 dark:text-gray-400">
                      {talk.conferencier.email}
                    </span>
                  </div>
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
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Modifier le statut du talk
            </h3>
            <p className="text-sm mb-2 text-gray-700 dark:text-gray-300">
              <strong>Titre :</strong> {selectedTalk.titre}
            </p>

            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Nouveau statut :
            </label>
            <select
              className="w-full border px-3 py-2 rounded-md text-sm dark:bg-gray-700 dark:text-white"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="EN_ATTENTE">En attente</option>
              <option value="ACCEPTE">Accepté</option>
              <option value="REFUSE">Refusé</option>
              <option value="PLANIFIE">Planifié</option>
            </select>

            {errorMessage && (
              <p className="text-sm text-red-600 mt-4">{errorMessage}</p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Planification */}
      {showScheduleModal && selectedTalk && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Planifier le talk
            </h3>
            <p className="text-sm mb-2 text-gray-700 dark:text-gray-300">
              <strong>Titre :</strong> {selectedTalk.titre}
            </p>

            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
              Salle :
            </label>
            <select
              className="w-full border px-3 py-2 rounded-md mb-4 text-sm dark:bg-gray-700 dark:text-white"
              value={selectedSalle}
              onChange={(e) => setSelectedSalle(Number(e.target.value))}
            >
              <option value="">-- Choisir une salle --</option>
              {salles.map((salle) => (
                <option key={salle.id_salle} value={salle.id_salle}>
                  {salle.nom_salle} {/* <-- correction ici */}
                </option>
              ))}
            </select>

            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
              Date :
            </label>
            <input
              type="date"
              className="w-full border px-3 py-2 rounded-md mb-4 text-sm dark:bg-gray-700 dark:text-white"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
              Heure :
            </label>
            <input
              type="time"
              className="w-full border px-3 py-2 rounded-md mb-4 text-sm dark:bg-gray-700 dark:text-white"
              value={selectedHeure}
              onChange={(e) => setSelectedHeure(e.target.value)}
            />

            {errorMessage && (
              <p className="text-sm text-red-600 mb-4">{errorMessage}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={closeScheduleModal}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                onClick={handleScheduleSubmit}
                className="px-4 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                Planifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

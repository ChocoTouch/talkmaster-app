import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import axiosInstance from "../../../utils/axiosInstance";
import { useEffect, useState } from "react";
import EditMyTalk from "../../../components/form/form-elements/EditMyTalk";
import DeleteMyTalk from "../../../components/form/form-elements/DeleteMyTalk";
import { Talk }from "../../../types/talks"
export default function MyTalksTable() {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [selectedTalk, setSelectedTalk] = useState<Talk | null>(null);
  const [formData, setFormData] = useState<Omit<Talk, "id_talk" | "statut">>({
    titre: "",
    sujet: "",
    description: "",
    duree: 0,
    niveau: "DEBUTANT",
    date: "",
    heure: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [talkToDelete, setTalkToDelete] = useState<Talk | null>(null);

  useEffect(() => {
    fetchTalks();
  }, []);

  const fetchTalks = async () => {
    try {
      const res = await axiosInstance.get("/talks/me");
      setTalks(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement :", err);
    }
  };

  const openModal = (talk: Talk) => {
    if (talk.statut !== "EN_ATTENTE") return;
    setSelectedTalk(talk);
    setFormData({
      titre: talk.titre,
      sujet: talk.sujet,
      description: talk.description,
      duree: talk.duree,
      niveau: talk.niveau,
      date: talk.date || "",
      heure: talk.heure || "",
    });
    setErrorMessage("");
  };

  const closeModal = () => {
    setSelectedTalk(null);
    setErrorMessage("");
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duree" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedTalk) return;

    try {
      await axiosInstance.put(`/talks/${selectedTalk.id_talk}`, {
        ...formData,
        statut: selectedTalk.statut,
      });
      await fetchTalks();
      closeModal();
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 403) {
        setErrorMessage("Vous n'avez pas l'autorisation de modifier ce talk.");
      } else if (status === 400) {
        setErrorMessage("Le talk ne peut plus être modifié.");
      } else {
        setErrorMessage("Une erreur s’est produite.");
      }
    }
  };

  const handleDeleteTalk = async () => {
    if (!talkToDelete) return;

    try {
      await axiosInstance.delete(`/talks/${talkToDelete.id_talk}`);
      await fetchTalks();
      setShowDeleteModal(false);
      setTalkToDelete(null);
      alert("✅ Talk supprimé avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression du talk :", error);
      alert("❌ Erreur lors de la suppression.");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader>Titre</TableCell>
              <TableCell isHeader>Sujet</TableCell>
              <TableCell isHeader>Durée</TableCell>
              <TableCell isHeader>Niveau</TableCell>
              <TableCell isHeader>Statut</TableCell>
              <TableCell isHeader>Actions</TableCell>
              <TableCell isHeader>Supprimer</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {talks.map((talk) => (
              <TableRow key={talk.id_talk}>
                <TableCell>{talk.titre}</TableCell>
                <TableCell>{talk.sujet}</TableCell>
                <TableCell>{talk.duree} min</TableCell>
                <TableCell>{talk.niveau}</TableCell>
                <TableCell>{talk.statut}</TableCell>
                <TableCell>
                  {talk.statut === "EN_ATTENTE" && (
                    <button
                      className="text-blue-600 hover:underline text-sm"
                      onClick={() => openModal(talk)}
                    >
                      Modifier
                    </button>
                  )}
                </TableCell>
                <TableCell>
                  {talk.statut !== "PLANIFIE" && (
                    <button
                      onClick={() => {
                        setTalkToDelete(talk);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Supprimer
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MODAL DE MODIFICATION */}
      {selectedTalk && (
        <EditMyTalk
          talk={selectedTalk}
          formData={formData}
          onChange={handleChange}
          onClose={closeModal}
          onSubmit={handleSubmit}
          errorMessage={errorMessage}
        />
      )}

      {/* MODALE DE SUPPRESSION */}
      {showDeleteModal && talkToDelete && (
        <DeleteMyTalk
          talk={talkToDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setTalkToDelete(null);
          }}
          onConfirm={handleDeleteTalk}
        />
      )}
    </div>
  );
}

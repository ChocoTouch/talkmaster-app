import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import axiosInstance from "../../../utils/axiosInstance";
import { useEffect, useState } from "react";

interface Talk {
  id_talk: number;
  titre: string;
  sujet: string;
  description: string;
  duree: number;
  niveau: "DEBUTANT" | "INTERMEDIAIRE" | "AVANCE";
  statut: "EN_ATTENTE" | "ACCEPTE" | "REFUSE" | "PLANIFIE";
  date?: string;
  heure?: string;
}

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
              <TableCell isHeader>Supprimer</TableCell> {/* 🧩 COLONNE AJOUTÉE */}
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
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Modifier le talk
            </h3>

            <div className="space-y-4">
              <input
                type="text"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                placeholder="Titre"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                name="sujet"
                value={formData.sujet}
                onChange={handleChange}
                placeholder="Sujet"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                rows={4}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
              <input
                type="number"
                name="duree"
                value={formData.duree}
                onChange={handleChange}
                placeholder="Durée en minutes"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
              <select
                name="niveau"
                value={formData.niveau}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="DEBUTANT">Débutant</option>
                <option value="INTERMEDIAIRE">Intermédiaire</option>
                <option value="AVANCE">Avancé</option>
              </select>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
              <input
                type="time"
                name="heure"
                value={formData.heure}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
              {errorMessage && (
                <p className="text-red-600 text-sm">{errorMessage}</p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE DE SUPPRESSION */}
      {showDeleteModal && talkToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirmation de suppression
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer le talk "
              <strong>{talkToDelete.titre}</strong>" ? Cette action est
              irréversible.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setTalkToDelete(null);
                }}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteTalk}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
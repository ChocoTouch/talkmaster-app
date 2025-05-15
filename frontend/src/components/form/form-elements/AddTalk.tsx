import { useState } from "react";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import axiosInstance from "../../../utils/axiosInstance.jsx";

// Composant Alert simple (à personnaliser selon ton design)
function Alert({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="mb-4 p-4 text-green-800 bg-green-100 rounded-md relative">
      {message}
      <button
        onClick={onClose}
        className="absolute top-1 right-2 font-bold text-green-800"
        aria-label="Close alert"
      >
        ×
      </button>
    </div>
  );
}

export default function AddTalk() {
  const [titre, setTitre] = useState("");
  const [sujet, setSujet] = useState("");
  const [description, setDescription] = useState("");
  const [duree, setDuree] = useState("");
  const [niveau, setNiveau] = useState("DEBUTANT");
  const [errors, setErrors] = useState({
    titre: "",
    sujet: "",
    description: "",
    duree: "",
    niveau: "",
  });

  const [successMessage, setSuccessMessage] = useState(""); // <-- état pour l'alerte succès

  const optionsSujet = [
    { value: "marketing", label: "Marketing" },
    { value: "development", label: "Development" },
    { value: "design", label: "Design" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      titre: titre === "" ? "Le titre est requis" : "",
      sujet: sujet === "" ? "Le sujet est requis" : "",
      description: description === "" ? "La description est requise" : "",
      duree: duree === "" ? "La durée est requise" : "",
      niveau: niveau === "" ? "Le niveau est requis" : "",
    };
    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        const response = await axiosInstance.post(
          "/talks",
          {
            titre,
            sujet,
            description,
            duree,
            niveau,
            statut: "EN_ATTENTE",
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 201) {
          setSuccessMessage("Votre proposition de talk a été soumise avec succès !");
          // Optionnel : reset du formulaire
          setTitre("");
          setSujet("");
          setDescription("");
          setDuree("");
          setNiveau("DEBUTANT");
          setErrors({
            titre: "",
            sujet: "",
            description: "",
            duree: "",
            niveau: "",
          });
        }
      } catch (error) {
        alert("Une erreur est survenue lors de la soumission."); // garde le toast erreur ou remplace ici aussi
      }
    }
  };

  return (
    <ComponentCard title="Proposer un Talk">
      {/* Affichage de l'alerte succès */}
      {successMessage && (
        <Alert message={successMessage} onClose={() => setSuccessMessage("")} />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre du talk */}
        <div>
          <Label htmlFor="titre">Titre</Label>
          <input
            type="text"
            id="titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Titre du talk"
            className="input-class"
          />
          {errors.titre && <p className="text-red-500 text-sm">{errors.titre}</p>}
        </div>

        {/* Sujet du talk */}
        <div>
          <Label htmlFor="sujet">Sujet</Label>
          <select
            id="sujet"
            value={sujet}
            onChange={(e) => setSujet(e.target.value)}
            className="input-class"
          >
            <option value="">Sélectionner un sujet</option>
            {optionsSujet.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.sujet && <p className="text-red-500 text-sm">{errors.sujet}</p>}
        </div>

        {/* Description du talk */}
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez votre talk"
            className="textarea-class"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        {/* Durée du talk */}
        <div>
          <Label htmlFor="duree">Durée</Label>
          <input
            type="text"
            id="duree"
            value={duree}
            onChange={(e) => setDuree(e.target.value)}
            placeholder="Durée du talk (ex : 20 min)"
            className="input-class"
          />
          {errors.duree && <p className="text-red-500 text-sm">{errors.duree}</p>}
        </div>

        {/* Niveau du talk */}
        <div>
          <Label htmlFor="niveau">Niveau</Label>
          <select
            id="niveau"
            value={niveau}
            onChange={(e) => setNiveau(e.target.value)}
            className="input-class"
          >
            <option value="DEBUTANT">Débutant</option>
            <option value="INTERMEDIAIRE">Intermédiaire</option>
            <option value="AVANCE">Avancé</option>
          </select>
          {errors.niveau && <p className="text-red-500 text-sm">{errors.niveau}</p>}
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-center">
          <button type="submit" className="submit-button-class">
            Soumettre
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}

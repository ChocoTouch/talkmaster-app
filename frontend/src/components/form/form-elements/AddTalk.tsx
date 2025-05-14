import { useState } from "react";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import Input from "../input/InputField.tsx";
import Select from "../Select.tsx";
import TextArea from "../input/TextArea.tsx"; // Composant pour TextArea (si nécessaire)
import { EyeCloseIcon, EyeIcon, TimeIcon } from "../../../icons/index.ts";
import DatePicker from "../date-picker.tsx";
import Button from "../../ui/button/Button.tsx"; // Si vous avez un bouton personnalisé
import { toast } from "react-toastify"; // Pour afficher les messages de succès ou d'erreur
import axiosInstance from "../../../utils/axiosInstance.jsx"; // L'instance Axios pour la requête API

export default function AddTalk() {
  const [showPassword, setShowPassword] = useState(false);
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

  const optionsSujet = [
    { value: "marketing", label: "Marketing" },
    { value: "development", label: "Development" },
    { value: "design", label: "Design" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation des champs
    const newErrors = {
      titre: titre === "" ? "Le titre est requis" : "",
      sujet: sujet === "" ? "Le sujet est requis" : "",
      description: description === "" ? "La description est requise" : "",
      duree: duree === "" ? "La durée est requise" : "",
      niveau: niveau === "" ? "Le niveau est requis" : "",
    };
    setErrors(newErrors);

    // Si aucune erreur, on soumet le formulaire
    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        // Utilisation d'une instance Axios pour envoyer les données au backend
        const response = await axiosInstance.post(
          "/talks",
          {
            titre,
            sujet,
            description,
            duree,
            niveau,
            statut: "EN_ATTENTE", // Statut par défaut lors de la soumission
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 201) {
          toast.success("Votre proposition de talk a été soumise avec succès !");
        }
      } catch (error) {
        toast.error("Une erreur est survenue lors de la soumission.");
      }
    }
  };

  return (
    <ComponentCard title="Proposer un Talk">
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
            className="input-class" // Ajouter des classes selon vos besoins
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
            className="input-class" // Ajouter des classes selon vos besoins
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
            className="textarea-class" // Ajouter des classes selon vos besoins
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
            className="input-class" // Ajouter des classes selon vos besoins
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
            className="input-class" // Ajouter des classes selon vos besoins
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
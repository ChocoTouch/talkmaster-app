import { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import axiosInstance from "../../../utils/axiosInstance.jsx"; // L'instance Axios pour la requête API
import { toast } from "react-toastify"; // Pour afficher les messages de succès ou d'erreur

export default function EditTalk({ talkId }: { talkId: string }) {
  const [titre, setTitre] = useState("");
  const [sujet, setSujet] = useState("");
  const [description, setDescription] = useState("");
  const [duree, setDuree] = useState("");
  const [niveau, setNiveau] = useState("DEBUTANT");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({
    titre: "",
    sujet: "",
    description: "",
    duree: "",
    niveau: "",
  });

  // Chargement initial des données du talk
  useEffect(() => {
    const fetchTalkData = async () => {
      try {
        const response = await axiosInstance.get(`/talks/${talkId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const talk = response.data;
        setTitre(talk.titre);
        setSujet(talk.sujet);
        setDescription(talk.description);
        setDuree(talk.duree);
        setNiveau(talk.niveau);
        setStatus(talk.statut);
      } catch (error) {
        toast.error("Une erreur est survenue lors du chargement des données.");
      }
    };

    fetchTalkData();
  }, [talkId]);

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
        // Vérification que le statut est en attente avant de permettre la modification
        if (status !== "EN_ATTENTE") {
          toast.error("Le talk ne peut être modifié que si son statut est 'EN_ATTENTE'.");
          return;
        }

        // Envoi des modifications via API PUT
        const response = await axiosInstance.put(
          `/talks/${talkId}`,
          {
            titre,
            sujet,
            description,
            duree,
            niveau,
            statut: "EN_ATTENTE", // Garder le statut en attente
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          toast.success("Les modifications ont été enregistrées avec succès !");
        }
      } catch (error) {
        toast.error("Une erreur est survenue lors de la mise à jour.");
      }
    }
  };

  return (
    <ComponentCard title="Modifier un Talk">
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
            disabled={status !== "EN_ATTENTE"} // Désactiver si le statut n'est pas "EN_ATTENTE"
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
            disabled={status !== "EN_ATTENTE"} // Désactiver si le statut n'est pas "EN_ATTENTE"
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
            disabled={status !== "EN_ATTENTE"} // Désactiver si le statut n'est pas "EN_ATTENTE"
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
            disabled={status !== "EN_ATTENTE"} // Désactiver si le statut n'est pas "EN_ATTENTE"
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
            disabled={status !== "EN_ATTENTE"} // Désactiver si le statut n'est pas "EN_ATTENTE"
          >
            <option value="DEBUTANT">Débutant</option>
            <option value="INTERMEDIAIRE">Intermédiaire</option>
            <option value="AVANCE">Avancé</option>
          </select>
          {errors.niveau && <p className="text-red-500 text-sm">{errors.niveau}</p>}
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-center">
          <button type="submit" className="submit-button-class" disabled={status !== "EN_ATTENTE"}>
            Sauvegarder les modifications
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}

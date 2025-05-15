import { useState } from "react";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import axiosInstance from "../../../utils/axiosInstance.jsx";

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

export default function AddRoom() {
  const [nomSalle, setNomSalle] = useState("");
  const [capacite, setCapacite] = useState("");
  const [errors, setErrors] = useState({ nomSalle: "", capacite: "" });
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      nomSalle: nomSalle.trim() === "" ? "Le nom de la salle est requis" : "",
      capacite:
        capacite.trim() === ""
          ? "La capacité est requise"
          : isNaN(Number(capacite)) || Number(capacite) <= 0
          ? "La capacité doit être un nombre positif"
          : "",
    };
    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        const response = await axiosInstance.post(
          "/api/salles/",
          {
            nom_salle: nomSalle,
            capacite: Number(capacite),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          setSuccessMessage("La salle a été ajoutée avec succès !");
          setNomSalle("");
          setCapacite("");
          setErrors({ nomSalle: "", capacite: "" });
        }
      } catch (error) {
        alert("Une erreur est survenue lors de la soumission.");
      }
    }
  };

  return (
    <ComponentCard title="Ajouter une Salle">
      {successMessage && (
        <Alert message={successMessage} onClose={() => setSuccessMessage("")} />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom de la salle */}
        <div>
          <Label htmlFor="nomSalle">Nom de la salle</Label>
          <input
            type="text"
            id="nomSalle"
            value={nomSalle}
            onChange={(e) => setNomSalle(e.target.value)}
            placeholder="Nom de la salle"
            className="input-class"
          />
          {errors.nomSalle && (
            <p className="text-red-500 text-sm">{errors.nomSalle}</p>
          )}
        </div>

        {/* Capacité */}
        <div>
          <Label htmlFor="capacite">Capacité</Label>
          <input
            type="number"
            id="capacite"
            value={capacite}
            onChange={(e) => setCapacite(e.target.value)}
            placeholder="Capacité de la salle"
            className="input-class"
            min={1}
          />
          {errors.capacite && (
            <p className="text-red-500 text-sm">{errors.capacite}</p>
          )}
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-center">
          <button type="submit" className="submit-button-class">
            Ajouter
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}

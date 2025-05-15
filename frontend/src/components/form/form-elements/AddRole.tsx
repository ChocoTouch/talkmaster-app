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

export default function AddRole() {
  const [nomRole, setNomRole] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nomRole.trim() === "") {
      setError("Le nom du rôle est requis");
      return;
    }
    setError("");

    try {
      const response = await axiosInstance.post(
        "/api/roles/",
        { nom_role: nomRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Le rôle a été ajouté avec succès !");
        setNomRole("");
      }
    } catch (err) {
      alert("Une erreur est survenue lors de la soumission.");
    }
  };

  return (
    <ComponentCard title="Ajouter un Rôle">
      {successMessage && (
        <Alert message={successMessage} onClose={() => setSuccessMessage("")} />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom du rôle */}
        <div>
          <Label htmlFor="nomRole">Nom du rôle</Label>
          <input
            type="text"
            id="nomRole"
            value={nomRole}
            onChange={(e) => setNomRole(e.target.value)}
            placeholder="Nom du rôle (ex: CONFERENCIER)"
            className="input-class"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
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
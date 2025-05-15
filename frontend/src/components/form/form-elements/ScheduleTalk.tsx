import { Room } from "../../../types/rooms";
import { useTalkStore } from "../../../store/talkStore";
import { Dispatch, SetStateAction } from "react";

interface ScheduleTalkProps {
  rooms: Room[];
  onClose: () => void;
  onSubmit: () => Promise<void>;
  errorMessage: string;
  setErrorMessage: Dispatch<SetStateAction<string>>;
}

export default function ScheduleTalk({
  rooms,
  onClose,
  onSubmit,
  errorMessage,
  setErrorMessage,
}: ScheduleTalkProps) {
  const { selectedTalk } = useTalkStore();

  if (!selectedTalk) return null;

  return (
    <div>
      {/* Exemple d'utilisation */}
      <h2>Planifier le talk : {selectedTalk.titre}</h2>
      <p>Choisissez une salle :</p>
      <select>
        {rooms.map((room) => (
          <option key={room.id_salle} value={room.id_salle}>
            {room.nom_salle} ({room.capacite} places)
          </option>
        ))}
      </select>

      {/* Gestion des erreurs */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose}>Annuler</button>
        <button onClick={onSubmit}>Valider</button>
      </div>
    </div>
  );
}

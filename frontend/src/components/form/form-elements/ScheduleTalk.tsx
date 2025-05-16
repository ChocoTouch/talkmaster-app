import { Room } from "../../../types/rooms";
import { Dispatch, SetStateAction } from "react";
import { Talk } from "../../../types/talks";

interface ScheduleTalkProps {
  rooms: Room[];
  selectedTalk: Talk;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  errorMessage: string;
  setErrorMessage: Dispatch<SetStateAction<string>>;
}

export default function ScheduleTalk({
  rooms,
  selectedTalk,
  onClose,
  onSubmit,
  errorMessage,
  setErrorMessage,
}: ScheduleTalkProps) {
  if (!selectedTalk) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Planifier le talk : {selectedTalk.titre}
        </h3>

        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
          Choisissez une salle :
        </label>
        <select
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          // Ici tu peux gérer la sélection avec un state si besoin
        >
          {rooms.map((room) => (
            <option key={room.id_salle} value={room.id_salle}>
              {room.nom_salle} ({room.capacite} places)
            </option>
          ))}
        </select>

        {errorMessage && (
          <p className="mt-3 text-red-500 font-medium">{errorMessage}</p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Annuler
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
}

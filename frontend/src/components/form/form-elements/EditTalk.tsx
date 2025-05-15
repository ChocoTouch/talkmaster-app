import { useState, useEffect } from "react";
import { useTalkStore } from "../../../store/talkStore";
import { Talk } from "../../../types/talks";
interface EditTalkProps {
  talk: Talk;
  initialStatus: string;
  onClose: () => void;
  onStatusUpdate: (newStatus: string) => Promise<void>;
}

export default function EditTalk({ onClose, onStatusUpdate }: EditTalkProps) {
  const { selectedTalk, updateTalkField } = useTalkStore();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (selectedTalk) {
      updateTalkField("statut", selectedTalk.statut);
    }
  }, [selectedTalk]);

  if (!selectedTalk) return null;

  const handleSave = async () => {
    setErrorMessage("");
    try {
      await onStatusUpdate(selectedTalk.statut);
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

  return (
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
          value={selectedTalk.statut}
          onChange={(e) => updateTalkField("statut", e.target.value)}
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
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}

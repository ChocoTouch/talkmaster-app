import { Talk } from "../../../types/talks";

interface DeleteMyTalkProps {
  talk: Talk;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteMyTalk({
  talk,
  onConfirm,
  onCancel,
}: DeleteMyTalkProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Confirmation de suppression
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
          Êtes-vous sûr de vouloir supprimer le talk{" "}
          <strong>{talk.titre}</strong> ? Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
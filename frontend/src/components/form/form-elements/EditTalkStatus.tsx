// components/EditTalkStatus.tsx
import React from "react";

interface EditTalkStatusProps {
  statut: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export default function EditTalkStatus({
  statut,
  onChange,
  onSubmit,
  onClose,
}: EditTalkStatusProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Modifier le statut du talk
        </h3>

        <select
          value={statut}
          onChange={onChange}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        >
          <option value="EN_ATTENTE">En attente</option>
          <option value="ACCEPTE">Accepté</option>
          <option value="REFUSE">Refusé</option>
        </select>

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
            Mettre à jour
          </button>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Talk } from "../../../types/talks";

interface EditMyTalkProps {
  talk: Talk;
  formData: Omit<Talk, "id_talk" | "statut">;
  onChange: (e: React.ChangeEvent<any>) => void;
  onClose: () => void;
  onSubmit: () => void;
  errorMessage: string;
}

export default function EditMyTalk({
  talk,
  formData,
  onChange,
  onClose,
  onSubmit,
  errorMessage,
}: EditMyTalkProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Modifier le talk
        </h3>

        <div className="space-y-4">
          <input
            type="text"
            name="titre"
            value={formData.titre}
            onChange={onChange}
            placeholder="Titre"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            name="sujet"
            value={formData.sujet}
            onChange={onChange}
            placeholder="Sujet"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            placeholder="Description"
            rows={4}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          <input
            type="number"
            name="duree"
            value={formData.duree}
            onChange={onChange}
            placeholder="Durée en minutes"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          <select
            name="niveau"
            value={formData.niveau}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="DEBUTANT">Débutant</option>
            <option value="INTERMEDIAIRE">Intermédiaire</option>
            <option value="AVANCE">Avancé</option>
          </select>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          <input
            type="time"
            name="heure"
            value={formData.heure}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          {errorMessage && (
            <p className="text-red-600 text-sm">{errorMessage}</p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Annuler
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import Alert from "../../../components/ui/alert/Alert";

interface EditTalkProps {
  titre: string;
  sujet: string;
  description: string;
  duree: number;
  niveau: "DEBUTANT" | "INTERMEDIAIRE" | "AVANCE";
  onChangeTitre: (value: string) => void;
  onChangeSujet: (value: string) => void;
  onChangeDescription: (value: string) => void;
  onChangeDuree: (value: number) => void;
  onChangeNiveau: (value: "DEBUTANT" | "INTERMEDIAIRE" | "AVANCE") => void;
  onUpdate: () => void;
  alert: {
    show: boolean;
    variant: "success" | "error";
    title: string;
    message: string;
  } | null;
}

export default function EditTalk({
  titre,
  sujet,
  description,
  duree,
  niveau,
  onChangeTitre,
  onChangeSujet,
  onChangeDescription,
  onChangeDuree,
  onChangeNiveau,
  onUpdate,
  alert,
}: EditTalkProps) {
  return (
    <div className="w-full lg:w-1/2">
      <h5 className="mb-2 font-semibold text-gray-800 dark:text-white/90 lg:text-2xl">
        Modifier les informations du Talk
      </h5>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Changez le titre, la description, la durée ou le niveau du talk
      </p>

      {alert?.show && (
        <div className="mb-4">
          <Alert
            variant={alert.variant}
            title={alert.title}
            message={alert.message}
          />
        </div>
      )}

      <div className="space-y-6">
        <InputField label="Titre" value={titre} onChange={onChangeTitre} />
        <InputField label="Sujet" value={sujet} onChange={onChangeSujet} />
        <TextAreaField
          label="Description"
          value={description}
          onChange={onChangeDescription}
        />
        <NumberField label="Durée (minutes)" value={duree} onChange={onChangeDuree} />
        <SelectField
          label="Niveau"
          value={niveau}
          onChange={onChangeNiveau}
          options={["DEBUTANT", "INTERMEDIAIRE", "AVANCE"]}
        />
      </div>

      <div className="flex mt-6">
        <button
          onClick={onUpdate}
          className="w-full justify-center rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white"
        >
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}

// --- Champs réutilisables (comme dans EditPlanning) ---
const InputField = ({ label, value, onChange, type = "text" }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full rounded-lg border border-gray-300 dark:bg-dark-900 px-4 py-2.5 text-sm text-gray-800 dark:text-white"
    />
  </div>
);

const TextAreaField = ({ label, value, onChange }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-300 dark:bg-dark-900 px-4 py-2.5 text-sm text-gray-800 dark:text-white"
      rows={4}
    />
  </div>
);

const NumberField = ({ label, value, onChange }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-11 w-full rounded-lg border border-gray-300 dark:bg-dark-900 px-4 py-2.5 text-sm text-gray-800 dark:text-white"
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full rounded-lg border border-gray-300 dark:bg-dark-900 px-4 py-2.5 text-sm text-gray-800 dark:text-white"
    >
      {options.map((opt: string) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

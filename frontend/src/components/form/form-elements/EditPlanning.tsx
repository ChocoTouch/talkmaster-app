import Alert from "../../../components/ui/alert/Alert";

interface EditPlanningProps {
  planningDate: string;
  planningHeure: string;
  planningSalleId: number;
  setPlanningDate: (value: string) => void;
  setPlanningHeure: (value: string) => void;
  setPlanningSalleId: (value: number) => void;
  onUpdate: () => void;
  alert: {
    show: boolean;
    variant: "success" | "error";
    title: string;
    message: string;
  } | null;
}

export default function EditPlanning({
  planningDate,
  planningHeure,
  planningSalleId,
  setPlanningDate,
  setPlanningHeure,
  setPlanningSalleId,
  onUpdate,
  alert,
}: EditPlanningProps) {
  return (
    <div className="w-full lg:w-1/2">
      <h5 className="mb-2 font-semibold text-gray-800 dark:text-white/90 lg:text-2xl">
        Modifier le Planning
      </h5>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Changez la date, l'heure ou la salle du talk
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
        <InputField
          label="Date"
          type="date"
          value={planningDate}
          onChange={setPlanningDate}
        />
        <InputField
          label="Heure"
          type="time"
          value={planningHeure}
          onChange={setPlanningHeure}
        />
        <NumberField
          label="Salle ID"
          value={planningSalleId}
          onChange={setPlanningSalleId}
        />
      </div>

      <div className="flex mt-6">
        <button
          onClick={onUpdate}
          className="w-full justify-center rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white"
        >
          Modifier le Planning
        </button>
      </div>
    </div>
  );
}

// Composants internes simples pour les champs (à placer en bas du fichier ou extraire dans un fichier local si besoin)

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
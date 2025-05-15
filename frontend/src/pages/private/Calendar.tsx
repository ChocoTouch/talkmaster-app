import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import Alert from "../../../src/components/ui/alert/Alert";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../../../src/components/ui/modal";
import { useModal } from "../../../src/hooks/useModal";
import PageMeta from "../../../src/components/common/PageMeta";
import axiosInstance from "../../../src/utils/axiosInstance";

interface CalendarEvent extends EventInput {
  extendedProps: {
    room: string;
    talkId: string;
    salle_id: number;
    description?: string;
    subject?: string;
    statut?: string;
  };
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Récupération du rôle
  const [role, setRole] = useState<number | null>(null);

  // Talk Fields
  const [eventTitle, setEventTitle] = useState("");
  const [eventSujet, setEventSujet] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDuree, setEventDuree] = useState(30);
  const [eventNiveau, setEventNiveau] = useState("DEBUTANT");

  // Planning Fields
  const [planningDate, setPlanningDate] = useState("");
  const [planningHeure, setPlanningHeure] = useState("");
  const [planningSalleId, setPlanningSalleId] = useState(0);

  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const [planningAlert, setPlanningAlert] = useState<{
    show: boolean;
    variant: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  // Récupérer le rôle depuis le token JWT au chargement
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role);
      } catch {
        setRole(null);
      }
    }
  }, []);

  useEffect(() => {
    axiosInstance
      .get("/plannings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const fetchedEvents = response.data.map((talk: any) => {
          const start = `${talk.date}T${talk.heure}`;
          const end = new Date(
            new Date(start).getTime() + 30 * 60000
          ).toISOString();

          return {
            id: talk.id_planning,
            title: talk.talk_titre,
            start,
            end,
            extendedProps: {
              description: talk.talk_description,
              subject: talk.talk_subject,
              statut: talk.talk_statut,
              room: talk.salle_nom,
              talkId: talk.talk_id,
              salle_id: talk.salle_id,
            },
          };
        });

        setEvents(fetchedEvents);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des talks", error);
      });
  }, []);

  const handleEventClick = async (clickInfo: EventClickArg) => {
    const event = clickInfo.event as unknown as CalendarEvent;
    const { talkId, salle_id } = event.extendedProps;

    setSelectedEvent(event);
    setPlanningDate(event.start?.toString().split("T")[0] || "");
    setPlanningHeure(event.start?.toString().split("T")[1]?.slice(0, 5) || "");
    setPlanningSalleId(event.extendedProps.salle_id || 0);

    try {
      const response = await axiosInstance.get(`/talks/${talkId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        const talk = response.data;
        setEventTitle(talk.titre);
        setEventSujet(talk.sujet);
        setEventDescription(talk.description);
        setEventDuree(talk.duree);
        setEventNiveau(talk.niveau);
        openModal();
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du Talk", error);
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent) return;

    try {
      await axiosInstance.put(
        `/talks/${selectedEvent.extendedProps.talkId}`,
        {
          titre: eventTitle,
          sujet: eventSujet,
          description: eventDescription,
          duree: eventDuree,
          niveau: eventNiveau,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      closeModal();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du talk", error);
    }
  };

  const handleUpdatePlanning = async () => {
    if (!selectedEvent) return;

    try {
      await axiosInstance.put(
        `/plannings/${selectedEvent.id}`,
        {
          salle_id: planningSalleId,
          date: planningDate,
          heure: `${planningHeure}:00`,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPlanningAlert({
        show: true,
        variant: "success",
        title: "Mise à jour réussie",
        message: "Le planning a été mis à jour avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du planning", error);

      setPlanningAlert({
        show: true,
        variant: "error",
        title: "Échec de la mise à jour",
        message: "Une erreur est survenue lors de la mise à jour du planning.",
      });
    }
  };

  // Affichage conditionnel selon le rôle
  // Admin = 4, Organisateur = 2, Conférencier = 1, etc.

  return (
    <>
      <PageMeta
        title="Planning des Talks"
        description="Vue du planning des talks"
      />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "",
            center: "title",
          }}
          events={events}
          eventClick={handleEventClick}
        />
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[900px] p-6 lg:p-10"
      >
        <div className="flex flex-col overflow-y-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Form Talk - visible uniquement Admin (4) */}
            {role === 4 ? (
              <div className="w-full lg:w-1/2">
                <h5 className="mb-2 font-semibold text-gray-800 dark:text-white/90 lg:text-2xl">
                  Modifier le Talk
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Modifiez les informations du talk
                </p>

                <div className="space-y-6">
                  <InputField
                    label="Titre du Talk"
                    value={eventTitle}
                    onChange={setEventTitle}
                  />
                  <InputField
                    label="Sujet"
                    value={eventSujet}
                    onChange={setEventSujet}
                  />
                  <TextAreaField
                    label="Description"
                    value={eventDescription}
                    onChange={setEventDescription}
                  />
                  <NumberField
                    label="Durée (min)"
                    value={eventDuree}
                    onChange={setEventDuree}
                  />
                  <SelectField
                    label="Niveau"
                    value={eventNiveau}
                    onChange={setEventNiveau}
                    options={["DEBUTANT", "INTERMEDIAIRE", "AVANCE"]}
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={closeModal}
                    className="flex-1 justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={handleUpdateEvent}
                    className="flex-1 justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white"
                  >
                    Mettre à jour Talk
                  </button>
                </div>
              </div>
            ) : (
              // Pour les autres roles, affichage lecture seule du talk
              <div className="w-full lg:w-1/2">
                <h5 className="mb-2 font-semibold text-gray-800 dark:text-white/90 lg:text-2xl">
                  Informations du Talk
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 whitespace-pre-wrap">
                  <strong>Titre :</strong> {eventTitle}
                  <br />
                  <strong>Sujet :</strong> {eventSujet}
                  <br />
                  <strong>Description :</strong> {eventDescription}
                  <br />
                  <strong>Durée :</strong> {eventDuree} min
                  <br />
                  <strong>Niveau :</strong> {eventNiveau}
                </p>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={closeModal}
                    className="flex-1 justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            )}

            {/* Form Planning - visible uniquement Admin (4) et Organisateur (2) */}
            {(role === 4 || role === 2) && (
              <div className="w-full lg:w-1/2">
                <h5 className="mb-2 font-semibold text-gray-800 dark:text-white/90 lg:text-2xl">
                  Modifier le Planning
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Changez la date, l'heure ou la salle du talk
                </p>

                {/* Alert Display */}
                {planningAlert?.show && (
                  <div className="mb-4">
                    <Alert
                      variant={planningAlert.variant}
                      title={planningAlert.title}
                      message={planningAlert.message}
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
                    onClick={handleUpdatePlanning}
                    className="w-full justify-center rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white"
                  >
                    Modifier le Planning
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

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

export default Calendar;

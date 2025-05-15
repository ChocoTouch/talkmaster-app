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
import EditPlanning from "../../components/form/form-elements/EditPlanning";
import { Talk } from "../../types/talks";
import EditTalk from "../../components/form/form-elements/EditTalk";

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
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );

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
        title="Calendrier | TalkMaster"
        description="Consultez et gérez les plannings des talks via une vue calendrier interactive."
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
            {/* Admin: édition Talk via EditTalk */}
            {role === 4 && selectedEvent && (
              <EditTalk
                talk={
                  {
                    titre: eventTitle,
                    sujet: eventSujet,
                    description: eventDescription,
                    duree: eventDuree,
                    niveau: eventNiveau,
                    statut: selectedEvent.extendedProps?.statut || "",
                  } as Talk
                }
                initialStatus={selectedEvent.extendedProps?.statut || ""}
                onClose={closeModal}
                onStatusUpdate={handleUpdateEvent}
              />
            )}

            {/* Non-admins: lecture seule */}
            {role !== 4 && (
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

            {/* Edit Planning pour Admin et Organisateur */}
            {(role === 4 || role === 2) && (
              <EditPlanning
                planningDate={planningDate}
                planningHeure={planningHeure}
                planningSalleId={planningSalleId}
                setPlanningDate={setPlanningDate}
                setPlanningHeure={setPlanningHeure}
                setPlanningSalleId={setPlanningSalleId}
                onUpdate={handleUpdatePlanning}
                alert={planningAlert}
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Calendar;

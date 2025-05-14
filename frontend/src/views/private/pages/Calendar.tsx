import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../../../components/ui/modal";
import { useModal } from "../../../hooks/useModal";
import PageMeta from "../../../components/common/PageMeta";
import axiosInstance from "../../../utils/axiosInstance";

interface CalendarEvent extends EventInput {
  extendedProps: {
    room: string;  // Salle où se déroule le talk
    talkId: string;  // ID du talk pour le lien API
  };
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventRoom, setEventRoom] = useState(""); // Salle de l'événement
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    // Charger les données du planning depuis l'API
    axiosInstance
      .get("/planning", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const fetchedEvents = response.data.map((talk: any) => ({
          id: talk.id,
          title: talk.titre,
          start: talk.dateDebut, // Utilisez les bonnes propriétés de votre API
          end: talk.dateFin,
          extendedProps: {
            room: talk.salle,
            talkId: talk.id, // Ajoutez un ID unique pour la mise à jour
          },
        }));
        setEvents(fetchedEvents);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des talks", error);
      });
  }, []);

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    setEventStartDate(event.start?.toISOString().split("T")[0] || "");
    setEventEndDate(event.end?.toISOString().split("T")[0] || "");
    setEventRoom(event.extendedProps.room);
    openModal();
  };

  const handleUpdateEvent = async () => {
    if (selectedEvent) {
      try {
        // Envoi de la mise à jour via API PUT
        const response = await axiosInstance.put(
          `/talks/${selectedEvent.id}`,
          {
            titre: eventTitle,
            dateDebut: eventStartDate,
            dateFin: eventEndDate,
            salle: eventRoom,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Mise à jour dans le state local si la modification est réussie
        if (response.status === 200) {
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event.id === selectedEvent.id
                ? {
                    ...event,
                    title: eventTitle,
                    start: eventStartDate,
                    end: eventEndDate,
                    extendedProps: {
                      ...event.extendedProps,
                      room: eventRoom,
                    },
                  }
                : event
            )
          );
          closeModal();
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du talk", error);
      }
    }
  };

  return (
    <>
      <PageMeta title="Planning des Talks" description="Vue du planning des talks" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          eventClick={handleEventClick}
        />
      </div>

      {/* Modal de modification */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6 lg:p-10">
        <div className="flex flex-col px-2 overflow-y-auto">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              Modifier le Talk
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">Modifiez les informations du talk</p>
          </div>

          <div className="mt-8">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Titre du Talk
              </label>
              <input
                id="event-title"
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800"
              />
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Salle
              </label>
              <input
                id="event-room"
                type="text"
                value={eventRoom}
                onChange={(e) => setEventRoom(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800"
              />
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Date de début
              </label>
              <input
                id="event-start-date"
                type="date"
                value={eventStartDate}
                onChange={(e) => setEventStartDate(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800"
              />
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Date de fin
              </label>
              <input
                id="event-end-date"
                type="date"
                value={eventEndDate}
                onChange={(e) => setEventEndDate(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700"
            >
              Fermer
            </button>
            <button
              onClick={handleUpdateEvent}
              type="button"
              className="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white"
            >
              Mettre à jour
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Calendar;

"use client";
import axios from "axios";
import { LinkIcon, EyeIcon, Pencil, Trash } from "lucide-react"; // Import icons from Lucide React
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteEventById } from "../../actions/event";
import toast, { Toaster } from "react-hot-toast";

type TimeSlot = {
  id: number;
  time: string;
  isBooked: boolean;
};

type DateSlot = {
  id: number;
  date: string;
  timeSlot: TimeSlot[];
};

type Event = {
  id: number;
  title: string;
  description: string;
  price: number;
  dateSlot: DateSlot[];
};

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

  const redirectToEvent = (id: string) => {
    router.push(`/events/${id}/edit`);
  };

  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/events/getEvent");
        setEvents(response.data);
      } catch (err) {
        setError("Error loading events.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);
  const deleteEvent = async (id: string) => {
    try {
      const response = await deleteEventById(id);
      if (response.status== 200) {
        setEvents(events.filter((event) => event.id.toString() !== id));
        toast.success("Event deleted successfully");
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-full mx-auto px-4 py-16">
      <Toaster />
      <div className="flex h-full flex-wrap justify-start gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="relative flex flex-row p-6 w-full sm:w-72 bg-black shadow-lg rounded-xl transform transition hover:scale-105"
          >
            <div className="block absolute inset-0 transform translate-x-[-10px] translate-y-[-10px] bg-teal-500 rounded-xl -z-10"></div>
            <div className="relative z-10 w-[90%] flex-col mb-4">
              <h2 className="text-xl font-bold mb-2">{event.title || "Event Title"}</h2>
              <p className="text-gray-700 mb-4">{event.description || "No description available"}</p>
            </div>

            {/* Buttons at the bottom */}
            <div className="flex-col   flex gap-4">
              <button
               onClick={() => deleteEvent(event.id.toString())}
               className="  bg-red-600 text-white p-2 rounded-full hover:bg-gray-700">
                <Trash className="w-6 h-6" />
              </button>
              <button
                onClick={() => redirectToEvent(event.id.toString())}
                className="bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600"
              >
                <Pencil className="w-6 h-6" />
              </button>
              <button
                onClick={() => openModal(event)}
                className="bg-gray-600 text-white p-2 rounded-full hover:bg-gray-700"
              >
                <EyeIcon className="w-6 h-6" />
              </button>
              
            </div>
          </div>
        ))}
      </div>

      {/* Modal for event details */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-11/12 sm:w-1/3">
            <h2 className="text-2xl font-bold mb-4">{selectedEvent.title}</h2>
            <p className="text-gray-700 mb-4">{selectedEvent.description}</p>
            <p className="text-gray-700 mb-4">Price:{selectedEvent.price} Rs</p>
            <div className="space-y-2">
              {selectedEvent.dateSlot.map((dateSlot) => (
                <div key={dateSlot.id} className="border p-4 rounded-lg">
                  <h4 className="font-semibold">
                    Date: {new Date(dateSlot.date).toLocaleDateString()}
                  </h4>
                  <div className="flex flew-row flex-wrap justify-start items-start gap-4 w-full">
                  {dateSlot.timeSlot.map((time) => (
                    <div
                      key={time.id}
                      className={`py-2  rounded-lg w-[40%] text-center ${
                        time.isBooked ? "bg-gray-400" : "bg-teal-500"
                      }`}
                    >
                      {new Date(time.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;

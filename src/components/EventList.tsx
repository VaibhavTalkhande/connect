"use client";
import axios from "axios";
import { Link, LinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type timeSlot = {
  id: number;
  time: string;
  isBooked: boolean;
};

type DateSlot = {
  id: number;
  date: string;
  timeSlot: timeSlot[];
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
  const router = useRouter()
  const redirectToEvent = (id: string) => {
    console.log(id);
     router.push(`/events/${id}/edit`);
  }
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

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-full mx-auto px-4 py-16">
      <div className="flex h-full flex-wrap    justify-start gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="relative p-6  max-w-[50%] bg-yellow-400 shadow-lg rounded-xl transform transition hover:scale-105"
          >
            <div className="absolute inset-0 transform translate-x-[-10px] translate-y-[-10px] bg-white rounded-xl -z-10"></div>
            <div className="relative z-10">
              <button onClick={() => redirectToEvent(event.id.toString())}>
                <LinkIcon className="w-6 h-6 inline-block mr-2" />
              </button>
              <h2 className="text-xl font-bold mb-2">
                {event.title || "Event Title"}
              </h2>
              <p className="text-gray-700 mb-4">
                {event.description || "No description available"}
              </p>

              {event.dateSlot?.map((dateSlot) => (
                <div key={dateSlot.id} className="mt-4">
                  <h4 className="text-lg font-semibold mb-2">
                    Date: {new Date(dateSlot.date).toLocaleDateString()}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {dateSlot.timeSlot?.length > 0 ? (
                      dateSlot.timeSlot.map((time) => (
                        <div
                          key={time.id}
                          className={`p-2 rounded-lg text-center text-white ${
                            time.isBooked ? "bg-gray-400" : "bg-indigo-600"
                          }`}
                        >
                          {new Date(time.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      ))
                    ) : (
                      <p className="col-span-full text-gray-500">
                        No available time slots
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;

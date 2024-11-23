"use client";
import { useEffect, useState } from "react";
import getEventById from "../../../../../actions/event"; // Adjust the path as needed
import { useSearchParams } from "next/navigation";

type TimeSlot = {
  id: string;
  time: Date; // Updated: Expecting a string
  isBooked: boolean;
};

type DateSlot = {
  id: string;
  date: Date; // Can be a Date or string before processing
  timeSlot: TimeSlot[];
};

type Event = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  dateSlot: DateSlot[];
};

const EventList = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const id = useSearchParams().get("id");

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        if (!id || id === "undefined") {
          setError("Invalid event ID");
          setLoading(false);
          return;
        }

        const response = await getEventById(id);

        if (response.status === 200 && response.event) {
          setEvent(response.event);
        } else {
          setError(response.message || "Error fetching event");
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Error loading event data.");
      }
      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {event && (
        <div key={event.id} className="mb-6 p-4 border bg-white rounded-lg">
          <h2 className="text-xl font-bold">{event.title || "Event Title"}</h2>
          <p>{event.description || "No description available"}</p>

          {event.dateSlot?.map((dateSlot) => (
            <div key={dateSlot.id} className="mt-4">
              <h4 className="text-lg font-semibold">
                Date:{" "}
                {dateSlot.date instanceof Date &&
                !isNaN(dateSlot.date.getTime())
                  ? dateSlot.date.toLocaleDateString()
                  : "Invalid Date"}
              </h4>
              <ul>
                {dateSlot.timeSlot.map((timeSlot) => (
                  <li key={timeSlot.id}>
                    {timeSlot.isBooked ? "Booked" : "Available"}
                    <input 
                      className="border border-gray-300 rounded-md"
                      type="time"
                      value={timeSlot.time.toLocaleTimeString(
                        "en-GB",
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;

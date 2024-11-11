"use client"
// /src/components/EventList.tsx
import { useEffect, useState } from "react";
import axios from "axios";

type TimeSlot = {
  id: number;
  time: string;
  isBooked: boolean;
};

type DateSlot = {
  id: number;
  date: string;
  timeSlots: TimeSlot[];
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

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
          const response = await axios.get("/api/events/getEvent");
          console.log(response.data)
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
    <div className="space-y-6 p-6 bg-white shadow-md rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Available Events</h1>
      {events.map((event) => (
        <div key={event.id} className="border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold">{event.title}</h2>
          <p>{event.description}</p>
          <p className="text-gray-800">Price: ₹{event.price}</p>

          <div className="mt-4">
            <h3 className="font-medium">Available Dates & Time Slots</h3>
            {event.dateSlot.map((dateSlot) => (
              <div key={dateSlot.id} className="mt-4">
                <h4 className="text-lg">
                  {new Date(dateSlot.date).toDateString()}
                </h4>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {dateSlot?.timeSlots?.map((timeSlot) => (
                    <div
                      key={timeSlot.id}
                      className={`p-2 rounded-lg text-center text-white ${
                        timeSlot.isBooked ? "bg-gray-400" : "bg-indigo-600"
                      }`}
                    >
                      {timeSlot.time}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;

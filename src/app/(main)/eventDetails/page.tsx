"use client"
// /src/components/EventList.tsx
import { useEffect, useState } from "react";
import axios from "axios";

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
   <div>
     {events.map((event) => (
       <div key={event.id} className="mb-6 p-4 border rounded-lg">
         <h2 className="text-xl font-bold">{event.title || "Event Title"}</h2>
         <p>{event.description || "No description available"}</p>

         {event.dateSlot?.map((dateSlot) => (
           <div key={dateSlot.id} className="mt-4">
             <h4 className="text-lg font-semibold">
               Date: {new Date(dateSlot.date).toLocaleDateString()}
             </h4>

             <div className="grid grid-cols-4 mt-2">
               {dateSlot.timeSlot?.length > 0 ? (
                 dateSlot.timeSlot?.map((time) => (
                   <div
                     key={time.id}
                     className={`p-4 rounded-lg text-center text-white w-2/3 ${
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
                 <p>No available time slots</p>
               )}
             </div>
           </div>
         ))}
       </div>
     ))}
   </div>
 );
};

export default EventList;

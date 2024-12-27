"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Event, getEventById } from "../../../../actions/event";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { time } from "console";


const timeSlotSchema = z.object({
  id:z.string(),
  time: z.date(),
  isBooked: z.boolean(),
})
const bookingSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  timeSlotId: z.string(),
  eventId: z.string(),
  timeSlot:timeSlotSchema,
});
const Page = () => {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<{
    date: Date;
    
  } | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [dates, setDates] = useState<{ date: Date; time: Date[] }[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      mentorId: params.mentor as string,
      eventId: "",
      name: "",
      email: "",
      date: new Date(),
      TimeSlot: {
        id:"",
        time: new Date(),
      }
    },
  });

  const fetchEvent = async () => {
    const bookingId = params.booking as string;
    if (bookingId) {
      try {
        const response = await getEventById(bookingId);
        setEvent(response?.event ?? null);
        setDates(
          response?.event?.dateSlot.map((date) => ({
            date: new Date(date.date),
            time: date.timeSlot.map((time) => new Date(time.time)),
          })) ?? []
        );
        form.setValue("eventId", response?.event?.id || "");
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [params.booking]);

  const handleDateChange = (date: Date) => {
    const selectedDate =
      dates.find((d) => d.date.toDateString() === date.toDateString()) ?? null;
    setSelectedDate(selectedDate);
    setShowDatePicker(true);
    form.setValue("date", date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: Date, timeSlotId: string) => {
    setSelectedTime(timeSlotId);
    form.setValue("time", time);
    form.setValue("timeSlotId", timeSlotId);
  };

  const onSubmit = async (data: z.infer<typeof bookingSchema>) => {
    try {
      setLoading(true);
      // Add your booking submission logic here
      console.log("Form data:", data);
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen p-10 text-teal-400 flex flex-col justify-center items-center">
      {event && (
        <div className="flex sm:flex-col lg:flex-row justify-evenly w-[80%] gap-1 items-center">
          <div className="flex flex-col w-[40%] gap-4">
            <span className="text-2xl font-extralight">Event Name</span>
            <h2 className="font-bold text-7xl">{event.title}</h2>
            <span className="text-2xl font-extralight">Description</span>
            <p className="text-3xl font-sans">{event.description}</p>
            <span className="text-2xl font-extralight">Price</span>
            <p className="text-2xl font-extralight">${event.price}</p>
          </div>

          <div className="flex flex-col w-1/2 gap-8">
            <Calendar
              mode="single"
              selected={selectedDate?.date}
              onSelect={(date) => date && handleDateChange(date)}
              disabled={(date) =>
                !dates.some(
                  (d) => d.date.toDateString() === date.toDateString()
                )
              }
              className="bg-black rounded-xl text-teal-500"
              modifiersClassNames={{
                selected: "rounded-xl bg-teal-500 text-white",
                root: "w-full shadow-lg pl-5 justify-center flex",
                chevron: "m-auto rounded-xl text-blue-500",
              }}
            />


          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

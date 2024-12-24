"use client"
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Event, getEventById } from '../../../../actions/event';
import { DayPicker } from 'react-day-picker'; // Import DayPicker
import '../../globals.css'; // Import DayPicker styles
import { Calendar } from '@/components/ui/calendar';
import { useForm } from 'react-hook-form';

const Page = () => {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<{ date: Date; time: Date[] } | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [dates, setDates] = useState<{ date: Date; time: Date[] }[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      mentorId: params.mentor as string,
      eventId: event?.id as string,
      date: selectedDate?.date as Date,
      time: selectedTime as Date,

    }
  });
  const fetchEvent = async () => {
    const bookingId = params.booking as string;
    if (bookingId) {
      try {
        const response = await getEventById(bookingId); // Fetch event using bookingId
        setEvent(response?.event ?? null);
        setDates(
            response?.event?.dateSlot.map((date) => ({
                date: date.date,
                time: date.timeSlot.map((time) => time.time),
            })) ?? []
            );
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [params.booking]); // Re-fetch when the booking param changes

  const handleDateChange = (date: Date) => {
    const selectedDate = dates.find((d) => d.date.toDateString() === date.toDateString()) ?? null;
    setSelectedDate(selectedDate);
    setShowDatePicker(true);
    console.log('Selected Date:', date);
  };

  return (
    <div className="relative min-h-screen p-10 text-teal-400 flex flex-col justify-center items-center">
      {event && (
        <div className="flex sm:flex-col  lg:flex-row justify-evenly  w-[80%] gap-1 items-center">
          <div className="flex flex-col w-[40%] gap-4">
            <span className="text-2xl font-extralight">Event Name</span>
            <h2 className="font-bold text-7xl">{event.title}</h2>
            <span className="text-2xl font-extralight">Description</span>
            <p className="text-3xl font-sans">{event.description}</p>
            <span className="text-2xl font-extralight">Price</span>
            <p className="text-2xl font-extralight">${event.price}</p>
          </div>

          {/* Calendar component */}
          <div className="my-4 flex justify-center w-1/2">
            <Calendar
              mode="single"
              selected={selectedDate ? selectedDate.date : undefined}
              onSelect={(date: unknown) =>
                dates.some((d) => d.date.toDateString() === (date as Date).toDateString())
              }
              onDayClick={handleDateChange}
              disabled={(date: Date) =>
                !dates.some(
                  (d) => d.date.toDateString() === date.toDateString()
                )
              }
              modifiersClassNames={{
                selected: `rounded-xl bg-teal-500 text-white`, // Highlight the selected day
                root: `w-[500px] shadow-lg  pl-5 justify-center flex`, // Add a shadow to the root element
                chevron: `m-auto rounded-xl  text-blue-500`,
              }}
              className="bg-black rounded-xl text-teal-500"
            />

            <div className="m-auto flex flex-col gap-1 justify-start items-start ">
              <h1>Available Time</h1>
              {showDatePicker &&
                selectedDate &&
                selectedDate.time.map((time) => (
                  <div
                    key={time.toISOString()}
                    className="flex flex-col bg-black rounded-md min-w-full text-teal-400 m-auto justify-center items-center"
                  >
                    <input type='radio' >{time.toLocaleTimeString()}</input>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

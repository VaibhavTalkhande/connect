"use client"
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Event, getEventById } from '../../../../actions/event';
import { DayPicker } from 'react-day-picker'; // Import DayPicker
import 'react-day-picker/dist/style.css'; // Import DayPicker styles
import { set } from 'zod';

const Page = () => {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<{ date: Date; time: Date[] } | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [dates, setDates] = useState<{ date: Date; time: Date[] }[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
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
    <div className="relative bg-white min-h-screen w-screen flex flex-col justify-center items-center">
      {event && (
        <div className="flex flex-col justify-center w-full items-center bg-cyan-400">
          <h2>{event.title}</h2>
          <p>{event.description}</p>
          <p>{event.price}</p>

          {/* Calendar component */}
          <div className="my-4">
            <DayPicker 
                mode='single'
                selected={selectedDate ? selectedDate.date : undefined}
                modifiers={{
                    selected: (date) => dates.some((d) => d.date.toDateString() === date.toDateString()),                    
                }}
                classNames={{
                    today: `border-amber-500`, // Add a border to today's date
                    selected: `bg-amber-500 border-amber-500 text-white`, // Highlight the selected day
                    root: `w-[500px] shadow-lg pl-5 justify-center flex`, // Add a shadow to the root element
                    chevron: `m-auto fill-amber-500` // Change the color of the chevron
                  }}
                disabled={(date:Date) => !dates.some((d) => d.date.toDateString() === date.toDateString())}
                onDayClick={handleDateChange}
             /> 
                {showDatePicker && (
                    selectedDate && (
                        selectedDate.time.map((time) => (
                            <div key={time.toISOString()} className="flex flex-col bg-black text-teal-400 m-auto justify-center items-center">
                                <p>{time.toLocaleTimeString()}</p>
                            </div>
                        ))
                    )
                )}
        
    
          </div>


          {/* {event.dateSlot.map((date) => (
            <div key={date.id}>
              <h3>{new Date(date.date).toLocaleDateString()}</h3>
              {date.timeSlot.map((time) => (
                <div key={time.id}>
                  <p>{new Date(time.time).toLocaleTimeString()}</p>
                  <p>{time.isBooked ? 'Booked' : 'Available'}</p>
                </div>
              ))}
            </div>
          ))} */}
        </div>
      )}
    </div>
  );
};

export default Page;

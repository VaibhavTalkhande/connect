"use client";
import React, { useState } from "react";
import { DayPicker } from "react-day-picker";

type TimeSlot = {
  time: string;
  isBooked: boolean;
};

type DateSlot = {
  date: string; // Format: YYYY-MM-DD
  timeSlots: TimeSlot[];
};

const dateSlots: DateSlot[] = [
  {
    date: "2024-06-10",
    timeSlots: [
      { time: "10:00 AM", isBooked: false },
      { time: "11:00 AM", isBooked: true },
      { time: "02:00 PM", isBooked: false },
    ],
  },
  {
    date: "2024-06-12",
    timeSlots: [
      { time: "09:00 AM", isBooked: false },
      { time: "01:00 PM", isBooked: true },
    ],
  },
  {
    date: "2024-06-15",
    timeSlots: [
      { time: "08:00 AM", isBooked: false },
      { time: "12:00 PM", isBooked: false },
    ],
  },
];

function MyDatePicker() {
  const [selected, setSelected] = useState<Date>();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const handleDaySelect = (date: Date | undefined) => {
    setSelected(date);

    if (date) {
      const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
      const matchedDateSlot = dateSlots.find(
        (slot) => slot.date === formattedDate
      );

      setTimeSlots(matchedDateSlot ? matchedDateSlot.timeSlots : []);
    } else {
      setTimeSlots([]);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-md shadow-md">
      <h1 className="text-xl font-bold mb-4 text-center">Pick a Date</h1>

      {/* React DayPicker */}
      <DayPicker
        mode="single"
        selected={selected}
              onSelect={handleDaySelect}
              modifiers={{
                booked: (date: Date) => {
                  const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
                  const matchedDateSlot = dateSlots.find(
                    (slot) => slot.date === formattedDate
                  );
                  return matchedDateSlot
                    ? matchedDateSlot.timeSlots.some((slot) => slot.isBooked)
                    : false;
                },
              }}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
        
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",}}
      />

      {/* Footer or Message */}
      <div className="mt-4 text-center">
        {selected ? (
          <p className="text-gray-700">
            Selected Date: <strong>{selected.toDateString()}</strong>
          </p>
        ) : (
          <p className="text-gray-500">Pick a day to see time slots.</p>
        )}
      </div>

      {/* Time Slots Display */}
      {timeSlots.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Available Time Slots</h2>
          <ul className="space-y-2">
            {timeSlots.map((slot, index) => (
              <li
                key={index}
                className={`p-2 border rounded-md text-center ${
                  slot.isBooked
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {slot.time} {slot.isBooked ? "(Booked)" : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No Time Slots */}
      {selected && timeSlots.length === 0 && (
        <p className="text-center mt-4 text-red-500">
          No time slots available for this date.
        </p>
      )}
    </div>
  );
}

export default MyDatePicker;

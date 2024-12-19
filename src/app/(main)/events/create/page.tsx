"use client";

import React, { useState } from "react";
import { useForm, Controller, useFieldArray, Control, FieldErrors} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useRouter} from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { createEvent } from "../../../../../actions/event";



const timeSlotSchema = z.object({
  time: z.string().refine((time) => new Date(time), {
    message: "Invalid time format",
  }),
  isBooked: z.boolean().optional(),
});
const dateSlotSchema = z.object({
  date: z
    .string()
    .refine((date) => new Date(date), { message: "Invalid date format" }),
  timeSlots: z
    .array(timeSlotSchema)
    .nonempty("At least one time slot is required"),
});
const EventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  price: z.number().min(1, "Price must be greater than 0"),
  dateSlots: z.array(dateSlotSchema).nonempty("At least one date slot is required"),
});

type EventSchemaType = z.infer<typeof EventSchema>;

const CreateEventForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EventSchemaType>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
  });

  const {
    fields: dateSlots,
    append: appendDateSlot,
    remove: removeDateSlot,
  } = useFieldArray({
    control,
    name: "dateSlots",
  });

  const onSubmit = async (data: EventSchemaType) => {
    // Format date and time data for backend compatibility
    try {
      const formattedData = {
        ...data,
        description: data.description ?? null,
        dateSlot: data.dateSlots.map((dateSlot) => ({
          ...dateSlot,
          date: new Date(dateSlot.date),
          timeSlot: dateSlot.timeSlots.map((timeSlot) => ({
            time: new Date(`1970-01-01T${timeSlot.time}`),
            isBooked: timeSlot.isBooked ?? false,
          })),
        })),
      };
      
      // Log the formatted data for debugging
      
      // Call the action
      const res = await createEvent(formattedData);
      // const res = await axios.post('/api/events/createEvent', formattedData);
      console.log('Response:', res);
      if (res?.status === 200) {
        toast.success('Event created successfully');
      }
      
      // Handle the response
      if (res?.success) {
        // Handle successful update (e.g., show success message, redirect)
        console.log('Event created successfully', res.event);
        router.push("/events")
        // Maybe use a toast or router to navigate/show success
      } else {
        // Handle error (show error message)
        console.error('Failed created event', res);
        // Maybe set an error state or show an error toast
      }
    } catch (error) {
      // Catch any unexpected errors
      console.error('Unexpected error in form submission', error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto p-6 bg-gray-100 shadow-md rounded-md space-y-6"
    >
      <Toaster/>
      <h1 className="text-xl font-bold text-center">Create Event</h1>

      <div className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Title</label>
          <input
            type="text"
            placeholder="Enter event title"
            className="w-full p-2 border border-gray-300 rounded-md"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Description</label>
          <input
            type="text"
            placeholder="Enter event description"
            className="w-full p-2 border border-gray-300 rounded-md"
            {...register("description")}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Price</label>
          <input
            type="number"
            placeholder="Enter event price"
            className="w-full p-2 border border-gray-300 rounded-md"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Date Slots Section */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Event Dates and Times</h2>

          {dateSlots.map((dateSlot, dateIndex) => (
            <div
              key={dateSlot.id}
              className="mb-6 p-4 border border-gray-200 rounded-md bg-white"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium">
                  Date Slot {dateIndex + 1}
                </h3>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeDateSlot(dateIndex)}
                  className="flex items-center"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Remove Date
                </Button>
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium">Date</label>
                <input
                  type="date"
                  {...register(`dateSlots.${dateIndex}.date` as const)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.dateSlots?.[dateIndex]?.date && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dateSlots[dateIndex]?.date?.message}
                  </p>
                )}
              </div>

              {/* Time Slots for this Date */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium">Time Slots</h4>
                </div>

                <TimeSlotFields
                  control={control}
                  dateSlotIndex={dateIndex}
                  errors={errors}
                />
              </div>
            </div>
          ))}

          {/* Add New Date Slot Button */}
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              appendDateSlot({
                date: new Date().toISOString(),
                timeSlots: [{ time: new Date().toLocaleString('en-GB'), isBooked: false }],
              })
            }
            className="w-full flex items-center justify-center"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Date Slot
          </Button>
        </div>

        <Button type="submit" className="w-full mt-6">
          Save Event Changes
        </Button>
      </div>
    </form>
  );
};

// Time Slot Fields
type TimeSlotFieldsProps = {
  control: Control<EventSchemaType>;
  dateSlotIndex: number;
  errors: FieldErrors<EventSchemaType>;
};

const TimeSlotFields: React.FC<TimeSlotFieldsProps> = ({
  control,
  dateSlotIndex,
  errors,
}) => {
  const { fields: timeSlots, append: appendTimeSlot,remove:removeTimeSlot } = useFieldArray({
    control,
    name: `dateSlots.${dateSlotIndex}.timeSlots`,
  });

  return (
    <div className="space-y-4 border-b border-black p-4">
      {timeSlots.map((timeSlot, index) => (
        <div key={timeSlot.id} className="flex items-center space-x-4">
          <Controller
            control={control}
            name={`dateSlots.${dateSlotIndex}.timeSlots.${index}.time` as const}
            render={({ field }) => (
              <input
                type="time"
                {...field}
                className="p-3 rounded-[0.5rem] border-2 border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            )}
          />
          {errors.dateSlots?.[dateSlotIndex]?.timeSlots?.[index]?.time && (
            <p className="mt-2 text-sm text-red-600">
              {errors.dateSlots[dateSlotIndex]?.timeSlots[index]?.time?.message}
            </p>
          )}
        <button
          type="button"
          onClick={() => removeTimeSlot(index)}
          className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
          Remove Time Slot
        </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => appendTimeSlot({ time: "", isBooked: false })}
        className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Another Time Slot
      </button>
    </div>
  );
};

export default CreateEventForm;

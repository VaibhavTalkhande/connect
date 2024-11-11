/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import axios from "axios";

const timeSlotSchema = z.object({
  time: z
    .string()
    .min(1, "Time is required")
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format, use HH:MM"), // Checks for valid "HH:MM" format
});

const dateSlotSchema = z.object({
  date: z
    .string()
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), "Invalid date format"),
  timeSlots: z
    .array(timeSlotSchema)
    .nonempty("At least one time slot is required"),
});

const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  price: z.number().min(1, "Price must be greater than 0"),
  dateSlots: z
    .array(dateSlotSchema)
    .nonempty("At least one date slot is required"),
});

// TypeScript type based on the schema
type CreateEventFormData = z.infer<typeof createEventSchema>;

const CreateEventForm = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      dateSlots: [
        {
          date: new Date(), // Set default date as a Date object
          timeSlots: [{ time: "" }],
        },
      ],
    },
  });

  const { fields: dateSlots, append: appendDateSlot } = useFieldArray({
    control,
    name: "dateSlots",
  });

  const onSubmit = async (data: CreateEventFormData) => {
    // Format date and time data for backend compatibility
    const formattedEventData = {
      title: data.title,
      description: data.description,
      price: data.price,
      dateSlots: data.dateSlots.map((dateSlot) => ({
        date: dateSlot.date,
        timeSlots: dateSlot.timeSlots.map((timeSlot) => ({
          time: timeSlot.time,
          isBooked: false,
        })),
      })),
    };

    try {
      const res = await axios.post(
        "/api/events/createEvent",
        formattedEventData
      );
      if (res.status === 201) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const onInvalid = (errors: any) => console.error(errors);

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="space-y-6 p-6 bg-white shadow-md rounded-xl"
    >
      {dateSlots.map((dateSlot, index) => (
        <div key={index}>
          <label className="block text-sm font-medium text-gray-700">
            Date Slot {index + 1}
          </label>
          <input
            type="date"
            {...register(`dateSlots.${index}.date` as const)}
            className="mt-1 block p-3 rounded-[0.5rem] border-2 border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.dateSlots?.[index]?.date && (
            <p className="mt-2 text-sm text-red-600">
              {errors.dateSlots[index]?.date?.message}
            </p>
          )}

          {/* TimeSlot Fields */}
          <TimeSlotFields
            control={control}
            dateSlotIndex={index}
            errors={errors}
          />

          <button
            type="button"
            onClick={() =>
              appendDateSlot({
                date: new Date().toISOString().split("T")[0],
                timeSlots: [{ time: "" }],
              })
            }
            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Another Date Slot
          </button>
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          placeholder="Event Title"
          className="mt-1 block w-full p-3 rounded-[0.5rem] border-2 border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          {...register("title")}
        />
        {errors.title && (
          <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          placeholder="What is the event about?"
          className="mt-1 block w-full p-3 rounded-[0.5rem] border-2 border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          {...register("description")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Price (in ₹)
        </label>
        <input
          type="number"
          {...register("price", { valueAsNumber: true })}
          className="mt-1 block w-full p-3 rounded-[0.5rem] border-2 border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="₹"
        />
        {errors.price && (
          <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Event
      </button>
    </form>
  );
};

// Time Slot Fields
const TimeSlotFields = ({
  control,
  dateSlotIndex,
  errors,
}: {
  control: any;
  dateSlotIndex: number;
  errors: any;
}) => {
  const { fields: timeSlots, append: appendTimeSlot } = useFieldArray({
    control,
    name: `dateSlots.${dateSlotIndex}.timeSlots`,
  });

  return (
    <div className="space-y-4 border-b border-black p-4">
      {timeSlots.map((timeSlot, index) => (
        <div key={timeSlot.id} className="flex items-center space-x-4">
          <input
            type="time"
            {...control.register(
              `dateSlots.${dateSlotIndex}.timeSlots.${index}.time` as const
            )}
            className="p-3 rounded-[0.5rem] border-2 border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.dateSlots?.[dateSlotIndex]?.timeSlots?.[index]?.time && (
            <p className="mt-2 text-sm text-red-600">
              {errors.dateSlots[dateSlotIndex]?.timeSlots[index]?.time?.message}
            </p>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => appendTimeSlot({ time: "" })}
        className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Another Time Slot
      </button>
    </div>
  );
};

export default CreateEventForm;

// types/ModelTypes.ts

export enum Role {
  MENTOR,
  MENTEE,
  ADMIN,
}
export enum PaymentStatus {
  PENDING,
  SUCCESS,
  FAILED,
}

export interface UserType {
  id: string;
  clerkUserId: string;
  email: string;
  username: string | null; // Nullable
  name: string | null; // Nullable
  imageUrl: string;
  role?: Role; // Nullable
  expertise?: string[];
  bio?: string | null; // Nullable
  events?: EventType[];
  bookings?: BookingType[];
  socials?: SocialType[];
}

export interface SocialType {
  id: string;
  userId: string;
  user: UserType;
  platform: string;
  link?: string;
}

export interface EventType {
  id: string;
  title: string;
  description: string;
  price: number;
  dateSlots: DateSlotType[];
  userId: string;
  user: UserType;
}

export interface DateSlotType {
  id: string;
  eventId: string;
  event: EventType;
  date: Date;
  timeSlots: TimeSlotType[];
}

export interface TimeSlotType {
  id: string;
  dateSlotId: string;
  dateSlot: DateSlotType;
  time: Date;
  isBooked: boolean;
  booking?: BookingType; // Optional
}

export interface BookingType {
  id: string;
  timeSlotId: string;
  timeSlot: TimeSlotType;
  userId: string;
  user: UserType;
  name: string;
  email: string;
  meetLink: string;
  googleEventId: string;
  paymentStatus: PaymentStatus;
  payment?: PaymentType;
}

export interface PaymentType {
  id: string;
  bookingId: string;
  amount: number;
  status: PaymentStatus;
  booking: BookingType;
}

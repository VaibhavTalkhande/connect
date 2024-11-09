export interface UserType {
  id: string;
  clerkUserId: string;
  email: string;
  username: string;
  name: string;
  imageUrl: string;
  role?: Role;
  expertise?: string[];
  bio?: string;
  events?: EventType[];
  bookings?: BookingType[];
  availability?: AvailabilityType[];
}

export interface EventType {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  userId: string;
  user: UserType;
  bookings: BookingType[];
}

export interface BookingType {
  id: string;
  eventId: string;
  event: EventType;
  userId: string;
  user: UserType;
  name: string;
  email: string;
  additionalInfo: string;
  startTime: Date;
  endTime: Date;
  meetLink: string;
  googleEventId: string;
  paymentStatus: string;
}

export interface AvailabilityType {
  id: string;
  userId: string;
  user: UserType;
  days: DaysAvailabilityType[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DaysAvailabilityType {
  id: string;
  availabilityId: string;
  day: DayOfWeek;
  startTime: Date;
  endTime: Date;
  timeGap: number;
  availability: AvailabilityType;
}

export interface PaymentType {
  id: string;
  bookingId: string;
  amount: number;
  status: PaymentStatus;
  booking: BookingType;
  createdAt: Date;
  updatedAt: Date;
}

export enum Role {
  MENTOR,
  MENTEE,
}

export enum DayOfWeek {
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY,
}

export enum PaymentStatus {
  PENDING,
  SUCCESS,
  FAILED,
}


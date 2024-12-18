"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
} from "@mui/material";
import getBooking from "@/../actions/booking";


export interface UserType {
  name: string | null;
  email: string;
}

export interface EventType {
  id: string;
  title: string;
  userId: string;
  description: string | null;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  user: UserType;
}

export interface DateSlotType {
  id: string;
  eventId: string;
  date: Date;
  event: EventType;
}

export interface TimeSlotType {
  id: string;
  dateSlotId: string;
  time: Date;
  isBooked: boolean;
  dateSlot: DateSlotType;
}

export interface BookingType {
  id: string;
  timeSlotId: string;
  userId: string;
  name: string;
  email: string;
  meetLink: string | null;
  googleEventId: string | null;
  paymentStatus: "PENDING" | "SUCCESS" | "FAILED";
  createdAt: Date;
  updatedAt: Date;
  timeSlot: TimeSlotType;
}

export interface BookingActionResponse {
  bookings?: BookingType[];
  message: string;
  status: number;
}

// In your frontend component
const BookingPage = () => {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Type assertion to match the exact Prisma query result
        const response: BookingActionResponse = await getBooking();

        if (response.status === 200 && response.bookings) {
          setBookings(response.bookings);
        } else {
          setError(response.message || "Failed to fetch bookings");
        }
      } catch (error) {
        console.error(error);
        setError("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box height="100%" p={2}>
      <Typography variant="h4" gutterBottom>
        Your Bookings
      </Typography>
      {bookings.length === 0 ? (
        <Typography>No bookings found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {bookings.map((booking) => (
            <Grid item xs={12} md={6} key={booking.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    Event: {booking.timeSlot.dateSlot.event.title}
                  </Typography>
                  <Typography>
                    Description:{" "}
                    {booking.timeSlot.dateSlot.event.description || "N/A"}
                  </Typography>
                  <Typography>
                    Date:{" "}
                    {new Date(
                      booking.timeSlot.dateSlot.date
                    ).toLocaleDateString()}
                  </Typography>
                  <Typography>
                    Time: {new Date(booking.timeSlot.time).toLocaleTimeString()}
                  </Typography>
                  <Typography>
                    Mentor: {booking.timeSlot.dateSlot.event.user.name}
                  </Typography>
                  <Typography>
                    Email: {booking.timeSlot.dateSlot.event.user.email}
                  </Typography>
                  {booking.meetLink && (
                    <Typography>
                      Meeting Link: <a href={booking.meetLink}>Join</a>
                    </Typography>
                  )}
                  <Typography>
                    Payment Status: {booking.paymentStatus}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default BookingPage;

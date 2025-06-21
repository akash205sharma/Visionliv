'use client'

import { useEffect, useState } from 'react';
import { useSession } from '@/context/SessionContext';
import { useRouter } from "next/navigation";

interface Booking {
  _id: string;
  listingId: {
    _id: string;
    image: string;
    location: string;
    price: number;
    nights: number;
  };
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  bookingDate: string;
}

export default function page() {
  const { session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    if (!session.status) router.push("/login")
  }, [])

  
  const fetchBookings = async () => {
    if (!session?._id) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/user/${session._id}`);
    const data = await res.json();
    setBookings(data.bookings);
  };

  useEffect(() => {
    fetchBookings();
  }, [session]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="border p-4 rounded-xl shadow flex gap-4">
              <img src={booking.listingId.image} alt="Listing" className="w-32 h-32 object-cover rounded-md" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{booking.listingId.location}</h2>
                <p className="text-sm text-gray-600">
                  {new Date(booking.checkIn).toLocaleDateString()} – {new Date(booking.checkOut).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">Total: ₹{booking.totalAmount}</p>
                <p className="text-xs text-gray-500">Booked on {new Date(booking.bookingDate).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



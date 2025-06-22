
'use client'

import { useSession } from '@/context/SessionContext'
import { Star } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CheckoutButton from '@/components/CheckoutButton'

const Map = dynamic(() => import('@/components/Map'), { ssr: false })

interface PropertyDetails {
  _id: string;
  image: string;
  location: string;
  price: number;
  nights: number;
  rating: number;
  description: string;
}
interface BookingDetails {
  bookingId: string;
  isbooked: boolean;
  bookingDate: string;
  checkIn: string;
  checkOut: string;
}

export default function PropertyDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = React.use(params)
  const [property, setProperty] = useState<PropertyDetails>()
  const [bookingData, setBookingData] = useState<BookingDetails>({ bookingId: "", isbooked: false, bookingDate: "", checkIn: "", checkOut: "" })
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sessionContext = useSession()
  const session = sessionContext?.session

  useEffect(() => {
    const fetchListingAndBooking = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/${id}`)
        if (!res.ok) throw new Error('Failed to fetch listing')
        const data = await res.json()
        setProperty(data.listing)

        if (session._id) {
          const bookingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: session._id, listingId: id }),
          })
          if (bookingRes.ok) {
            const bookingData = await bookingRes.json()
            const b = bookingData.isBooked
            setBookingData({
              bookingId: b._id,
              isbooked: true,
              bookingDate: b.bookingDate,
              checkIn: b.checkIn,
              checkOut: b.checkOut,
            })
          }
        }
      } catch (err: any) {
        setError(err.message || 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchListingAndBooking()
  }, [session])

  useEffect(() => {
    const getCoordinates = async () => {
      try {
        const location = encodeURIComponent(property?.location || '')
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`)
        const data = await res.json()
        if (data.length > 0) {
          setLatLng({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) })
        }
      } catch (error) {
        console.error('Failed to fetch location:', error)
      }
    }
    if (property?.location) getCoordinates()
  }, [property?.location])

  const handleBook = async () => {
    if (!bookingData?.checkIn || !bookingData?.checkOut) {
      alert('Choose check-in and check-out dates first')
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session._id,
          listingId: id,
          bookingDate: new Date().toISOString(),
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          totalAmount: property?.price,
        }),
      })
      if (res.ok) {
        const data = await res.json();
        setBookingData({ ...bookingData, bookingId: data.booking?._id, isbooked: true })
      }
    } catch (error) {
      console.error(error)
    }
  }
  const handelCancel = async () => {
    if (!bookingData.isbooked) {
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingData.bookingId}?userId=${session._id}&listingId=${id}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        setBookingData({ bookingId: "", isbooked: false, bookingDate: "", checkIn: "", checkOut: "" })
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (!property) return <div className="p-8 text-lg font-medium text-gray-600">Property not found.</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-10">
      <button
        onClick={() => router.back()}
        className="text-blue-600 hover:text-blue-800 text-sm font-semibold mb-6"
      >
        ← Go Back
      </button>

      <div className="rounded-3xl overflow-hidden shadow-xl mb-6">
        <img src={property.image} alt={property.location} className="w-full h-72 sm:h-[400px] object-cover" />
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">{property.location}</h1>
          <div className="flex items-center gap-1 mt-2 text-yellow-500">
            <Star size={20} fill="currentColor" />
            <span className="text-lg font-medium">{property.rating}</span>
          </div>
          <div className="mt-2 text-xl text-gray-700">
            ${property.price} / {property.nights} night{property.nights > 1 ? 's' : ''}
          </div>
        </div>

        <p className="text-gray-600 text-base leading-relaxed">{property.description}</p>

        {bookingData?.isbooked ? (
          <div className="relative bg-green-50 p-4 rounded-lg shadow-inner border border-green-200">
            <div onClick={handelCancel} className=' cursor-pointer absolute ml-2 mt- px-3 py-3 w-fit right-2 top-2 text-xs
                bg-gradient-to-r from-rose-500 to-pink-600 
                text-white font-semibold 
                rounded-xl shadow-md 
                hover:from-rose-600 hover:to-pink-700 
                hover:shadow-lg 
                active:scale-95 active:shadow-sm 
                transition duration-200 ease-in-out transform"' >Cancel Booking</div>
            <p className="text-green-800 font-semibold mb-2">Already Booked</p>
            <p className="text-sm text-gray-700">Check-in: {new Date(bookingData.checkIn).toLocaleDateString()}</p>
            <p className="text-sm text-gray-700">Check-out: {new Date(bookingData.checkOut).toLocaleDateString()}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={bookingData?.checkIn}
                onChange={(e) => {
                  setBookingData({ ...bookingData, checkIn: e.target.value })
                }}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={bookingData?.checkOut}
                onChange={e => {
                  setBookingData({ ...bookingData, checkOut: e.target.value })
                }}
                min={bookingData?.checkIn}
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 mt-4">
          {bookingData?.isbooked ? (
            <button
              className="
                ml-2 mt- px-6 py-3 
                bg-gradient-to-r from-green-500 to-cyan-600 
                text-white font-semibold 
                rounded-xl shadow-md 
                hover:from-green-600 hover:to-cyan-700 
                hover:shadow-lg 
                active:scale-95 active:shadow-sm 
                transition duration-200 ease-in-out transform"
              disabled
            >
              Booked
            </button>
          ) : (
            <button
              onClick={handleBook}
              className="ml-2 mt- px-6 py-3 
                bg-gradient-to-r from-rose-500 to-pink-600 
                text-white font-semibold 
                rounded-xl shadow-md 
                hover:from-rose-600 hover:to-pink-700 
                hover:shadow-lg 
                active:scale-95 active:shadow-sm 
                transition duration-200 ease-in-out transform"
            >
              Book Now
            </button>
          )}
          <CheckoutButton listing={property} userId={session.id} amount={property.price} />
        </div>

        <div className="pt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Location</h2>
          {latLng ? (
            <div className="h-[300px] sm:h-[400px] rounded-xl overflow-hidden border shadow">
              <Map lat={latLng.lat} lng={latLng.lng} />
            </div>
          ) : (
            <p className="text-sm text-gray-500">Location not found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useSession } from '@/context/SessionContext';
import { Star } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface PropertyDetails {
  _id: string;
  image: string
  location: string
  price: number
  nights: number
  rating: number
  description: string
  checkIn?: Date,
  checkOut?: Date,
}

// const sampleProperties: PropertyDetails[] = [
//   {
//     id: 1,
//     image: 'https://a0.muscache.com/im/pictures/miso/Hosting-1408350578634072065/original/7d7a0948-3163-4589-afe5-72a91d3c70bd.jpeg?im_w=1200',
//     location: 'Ubud, Bali, Indonesia',
//     price: 120,
//     nights: 2,
//     rating: 4.8,
//     description: 'A peaceful jungle retreat surrounded by lush greenery, featuring a private plunge pool and open-air living space.',
//   },
//   {
//     id: 2,
//     image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEwNDE5MzMyODE5MzA3ODk1MA%3D%3D/original/db44399f-6c9d-4691-abc2-fd198f198cb3.jpeg?im_w=1200',
//     location: 'Aspen, Colorado, USA',
//     price: 200,
//     nights: 1,
//     rating: 4.9,
//     description: 'A cozy wooden cabin nestled in the snowy Rockies with a fireplace and ski-in, ski-out access.',
//   },
//   {
//     id: 3,
//     image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-1411615243808363308/original/012b494b-80a6-4d86-96b6-40de654b331e.jpeg?im_w=1200',
//     location: 'Le Marais, Paris, France',
//     price: 150,
//     nights: 2,
//     rating: 4.7,
//     description: 'Elegant Parisian apartment with vintage decor and views of cobblestone streets, walking distance to cafes and art galleries.',
//   },
//   {
//     id: 4,
//     image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-1411615243808363308/original/b57c3225-ab49-4238-a56b-fb33ea2401ef.jpeg?im_w=720',
//     location: 'Goa, India',
//     price: 90,
//     nights: 3,
//     rating: 4.5,
//     description: 'A tropical beach house just steps from the ocean with colorful interiors and a laid-back vibe.',
//   },
//   {
//     id: 5,
//     image: 'https://a0.muscache.com/im/pictures/miso/Hosting-47852194/original/3a435e10-4817-43f4-be70-4b98f74181ce.jpeg?im_w=1200',
//     location: 'Kyoto, Japan',
//     price: 180,
//     nights: 2,
//     rating: 4.9,
//     description: 'Traditional ryokan with tatami floors, paper sliding doors, and a serene garden view.',
//   },
//   {
//     id: 6,
//     image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-1411615243808363308/original/50684fe2-862f-4f67-806d-c274d08f6231.jpeg?im_w=720',
//     location: 'Shoreditch, London, UK',
//     price: 210,
//     nights: 1,
//     rating: 4.6,
//     description: 'Modern loft in the heart of Shoreditch with industrial decor and easy access to bars, markets, and street art.',
//   },
//   {
//     id: 7,
//     image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-1411615243808363308/original/3cbcb709-cb7a-4575-85e2-09252a7f0b9a.jpeg?im_w=720',
//     location: 'Sedona, Arizona, USA',
//     price: 170,
//     nights: 2,
//     rating: 4.8,
//     description: 'Desert adobe retreat with red rock views and a hot tub under the stars.',
//   },
//   {
//     id: 8,
//     image: 'https://a0.muscache.com/im/pictures/miso/Hosting-47852194/original/9fc27680-2470-426d-aa10-7fced85235f4.jpeg?im_w=720',
//     location: 'Chamonix, France',
//     price: 230,
//     nights: 3,
//     rating: 4.9,
//     description: 'Alpine chalet with snow-capped mountain views, fireplace, and ski lift access.',
//   },
//   {
//     id: 9,
//     image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTI2NTc4NTY3NzQ0MTE2Njk1MA%3D%3D/original/d66dfc2f-5216-455b-a0dc-439e2ef321a3.png?im_w=1200',
//     location: 'Vancouver Island, Canada',
//     price: 140,
//     nights: 2,
//     rating: 4.7,
//     description: 'Coastal cabin surrounded by forest with access to private beaches and hiking trails.',
//   },
//   {
//     id: 10,
//     image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-1286073538504463602/original/e7fd1217-599c-4870-8f98-2d5048cc4b23.jpeg?im_w=720',
//     location: 'County Kerry, Ireland',
//     price: 250,
//     nights: 2,
//     rating: 4.8,
//     description: 'Historic stone cottage on the countryside with thatched roof, fireplace, and rolling green views.',
//   },
//   {
//     id: 11,
//     image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-1286073538504463602/original/d32426ae-80f4-4b51-ada5-ff9df890fd7b.jpeg?im_w=720',
//     location: 'Byron Bay, Australia',
//     price: 300,
//     nights: 1,
//     rating: 4.9,
//     description: 'Chic beachside studio just steps from white sand beaches with surfboards and local cafes nearby.',
//   },
//   {
//     id: 12,
//     image: 'https://a0.muscache.com/im/pictures/miso/Hosting-1286073538504463602/original/01e22d94-5751-4aa3-a459-c6b9e374c000.jpeg?im_w=720',
//     location: 'Amazon Rainforest, Brazil',
//     price: 160,
//     nights: 2,
//     rating: 4.6,
//     description: 'Eco-lodge deep in the rainforest with wildlife tours, treehouse views, and river boat access.',
//   },
//   {
//     id: 13,
//     image: 'https://a0.muscache.com/im/pictures/5cc6327a-27db-4642-8725-b4cdf267a2a5.jpg?im_w=1200',
//     location: 'Maasai Mara, Kenya',
//     price: 220,
//     nights: 3,
//     rating: 4.9,
//     description: 'Luxury safari tent with daily wildlife sightings, sunrise views, and local Maasai hospitality.',
//   },
//   {
//     id: 14,
//     image: 'https://a0.muscache.com/im/pictures/5eb142d5-fa19-4579-a17f-162af1b10de1.jpg?im_w=720',
//     location: 'Lapland, Finland',
//     price: 275,
//     nights: 2,
//     rating: 4.7,
//     description: 'Glass igloo under the stars, perfect for northern lights viewing in snowy silence.',
//   },
//   {
//     id: 15,
//     image: 'https://a0.muscache.com/im/pictures/ad467a6d-2188-4097-9430-09ac51e6fbc5.jpg?im_w=720',
//     location: 'Manhattan, New York, USA',
//     price: 400,
//     nights: 1,
//     rating: 4.8,
//     description: 'High-rise apartment in the heart of Manhattan with skyline views and designer furnishings.',
//   },
// ];



import React, { useEffect, useState } from 'react'

export default function PropertyDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = React.use(params)
  const [property, setProperty] = useState<PropertyDetails>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sessionContext = useSession();
  const session = sessionContext?.session;
  const [isbooked, setIsBooked] = useState(false);

  useEffect(() => {
    const fetchListingAndBooking = async () => {
      setLoading(true)
      setError(null)

      try {
        // 1. Get listing
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/${id}`)
        if (!res.ok) throw new Error("Failed to fetch listing")
        const data = await res.json()
        setProperty(data.listing)


        // 2. Check if already booked (only if session is available)
        if (session._id) {
          const bookingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/check`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: session._id, listingId: id }),
          })

          if (bookingRes.ok) {
            const bookingData = await bookingRes.json()
            setIsBooked(bookingData.isBooked) // true or false
          }
        }

      } catch (err: any) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchListingAndBooking()
  }, [session])


  const handleBook = async () => {
    if(!property?.checkIn||!property.checkOut){
      alert("Chose check In and check Out dates first")
      return;
    }
    let url = `${process.env.NEXT_PUBLIC_API_URL}/bookings`;
    let body = {
      userId: session._id,
      listingId: id,
      bookingDate: new Date().toISOString(),
      checkIn: property?.checkIn,
      checkOut: property?.checkOut,
      totalAmount: property?.price
    }
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
      console.log(res)
      if (res.ok) setIsBooked(true);

    } catch (error) {
      console.error(error);
    }
  }

  if (!property) return <div className="p-8 text-xl">Property not found.</div>

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      <button onClick={() => router.back()} className="text-blue-500 underline mb-6">&larr; Go Back</button>

      <div className="rounded-3xl overflow-hidden shadow-lg">
        <img
          src={property.image}
          alt={property.location}
          className="w-full h-[400px] object-cover"
        />
      </div>

      <div className="mt-6">
        <h1 className="text-3xl font-bold text-gray-800">{property.location}</h1>
        <div className="flex items-center mt-2 text-yellow-500">
          <Star size={20} fill="currentColor" className="mr-1" />
          <span className="text-lg font-medium">{property.rating}</span>
        </div>

        <div className="mt-4 text-gray-600 text-lg">
          ${property.price} / {property.nights} night{property.nights > 1 ? 's' : ''}
        </div>

        <p className="mt-6 text-gray-700 leading-relaxed">
          {property.description}
        </p>


        <div className="flex flex-col md:flex-row gap-4 mt-8 items-center">
          <div className="flex flex-col">
            <label className="font-medium mb-1">Check-in</label>
            <input
              type="date"
              className="border rounded px-3 py-2"
              value={
                property.checkIn
                  ? typeof property.checkIn === "string"
                    ? property.checkIn
                    : property.checkIn instanceof Date
                      ? property.checkIn.toISOString().split("T")[0]
                      : ""
                  : ""
              }
              onChange={e => setProperty(prev => prev ? { ...prev, checkIn: new Date(e.target.value) } : prev)}
              min={new Date().toISOString().split("T")[0]}
              disabled={isbooked}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium mb-1">Check-out</label>
            <input
              type="date"
              className="border rounded px-3 py-2"
              value={
                property.checkOut
                  ? typeof property.checkOut === "string"
                    ? property.checkOut
                    : property.checkOut instanceof Date
                      ? property.checkOut.toISOString().split("T")[0]
                      : ""
                  : ""
              }
              onChange={e => setProperty(prev => prev ? { ...prev, checkOut: new Date(e.target.value) } : prev)}
              min={
                property.checkIn
                  ? (typeof property.checkIn === "string"
                    ? property.checkIn
                    : property.checkIn instanceof Date
                      ? property.checkIn.toISOString().split("T")[0]
                      : "")
                  : new Date().toISOString().split("T")[0]
              }
              disabled={isbooked}
            />
          </div>
        </div>


        {isbooked ? <button
          className="mt-8 px-6 py-3 bg-gradient-to-r from-green-500 to-green-500 text-white rounded-xl shadow hover:shadow-lg transition"
        >Booked</button> :
          <button
            onClick={handleBook}
            className="mt-8 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl shadow hover:shadow-lg transition"
          >Book Now</button>}
      </div>
    </div>
  )
}

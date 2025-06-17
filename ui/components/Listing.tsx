'use client'

import { Star } from 'lucide-react'
import Link from 'next/link'

interface Property {
  id: number
  image: string
  location: string
  price: number
  nights: number
  rating: number
}
const properties: Property[] = [
  { id:  1, image: 'https://a0.muscache.com/im/pictures/miso/Hosting-1408350578634072065/original/7d7a0948-3163-4589-afe5-72a91d3c70bd.jpeg?im_w=1200', location: 'Ubud, Bali, Indonesia', price: 120, nights: 2, rating: 4.8 },
  { id:  2, image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEwNDE5MzMyODE5MzA3ODk1MA%3D%3D/original/db44399f-6c9d-4691-abc2-fd198f198cb3.jpeg?im_w=1200', location: 'Aspen, Colorado, USA', price: 200, nights: 1, rating: 4.9 },
  { id:  3, image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-1411615243808363308/original/012b494b-80a6-4d86-96b6-40de654b331e.jpeg?im_w=1200', location: 'Le Marais, Paris, France', price: 150, nights: 2, rating: 4.7 },
  { id:  4, image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-1411615243808363308/original/b57c3225-ab49-4238-a56b-fb33ea2401ef.jpeg?im_w=720', location: 'Goa, India', price: 90, nights: 3, rating: 4.5 },
  { id:  5, image: 'https://a0.muscache.com/im/pictures/miso/Hosting-47852194/original/3a435e10-4817-43f4-be70-4b98f74181ce.jpeg?im_w=1200', location: 'Kyoto, Japan', price: 180, nights: 2, rating: 4.9 },
  { id:  6, image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-1411615243808363308/original/50684fe2-862f-4f67-806d-c274d08f6231.jpeg?im_w=720', location: 'Shoreditch, London, UK', price: 210, nights: 1, rating: 4.6 },
  { id:  7, image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-1411615243808363308/original/3cbcb709-cb7a-4575-85e2-09252a7f0b9a.jpeg?im_w=720', location: 'Sedona, Arizona, USA', price: 170, nights: 2, rating: 4.8 },
  { id:  8, image: 'https://a0.muscache.com/im/pictures/miso/Hosting-47852194/original/9fc27680-2470-426d-aa10-7fced85235f4.jpeg?im_w=720', location: 'Chamonix, France', price: 230, nights: 3, rating: 4.9 },
  { id:  9, image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTI2NTc4NTY3NzQ0MTE2Njk1MA%3D%3D/original/d66dfc2f-5216-455b-a0dc-439e2ef321a3.png?im_w=1200', location: 'Vancouver Island, Canada', price: 140, nights: 2, rating: 4.7 },
  { id: 10, image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-1286073538504463602/original/e7fd1217-599c-4870-8f98-2d5048cc4b23.jpeg?im_w=720', location: 'County Kerry, Ireland', price: 250, nights: 2, rating: 4.8 },
  { id: 11, image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-1286073538504463602/original/d32426ae-80f4-4b51-ada5-ff9df890fd7b.jpeg?im_w=720', location: 'Byron Bay, Australia', price: 300, nights: 1, rating: 4.9 },
  { id: 12, image: 'https://a0.muscache.com/im/pictures/miso/Hosting-1286073538504463602/original/01e22d94-5751-4aa3-a459-c6b9e374c000.jpeg?im_w=720', location: 'Amazon Rainforest, Brazil', price: 160, nights: 2, rating: 4.6 },
  { id: 13, image: 'https://a0.muscache.com/im/pictures/5cc6327a-27db-4642-8725-b4cdf267a2a5.jpg?im_w=1200', location: 'Maasai Mara, Kenya', price: 220, nights: 3, rating: 4.9 },
  { id: 14, image: 'https://a0.muscache.com/im/pictures/5eb142d5-fa19-4579-a17f-162af1b10de1.jpg?im_w=720', location: 'Lapland, Finland', price: 275, nights: 2, rating: 4.7 },
  { id: 15, image: 'https://a0.muscache.com/im/pictures/ad467a6d-2188-4097-9430-09ac51e6fbc5.jpg?im_w=720', location: 'Manhattan, New York, USA', price: 400, nights: 1, rating: 4.8 },
];



export default function PropertyListings() {
  return (
    <section className="px-6 py-12 bg-gradient-to-br from-sky-50 to-rose-50 min-h-screen">
      <h2 className="text-3xl font-semibold text-gray-800 mb-10 text-center">
        Explore Beautiful Stays
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {properties.map((property) => (
          <Link href={`property/${property.id}`}
            key={property.id}
            className= "cursor-pointer bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-2xl transition-all duration-200"
          >
            <img
              src={property.image}
              alt={property.location}
              className="w-full h-60 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-gray-800">
                  {property.location}
                </h3>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm">{property.rating}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                ${property.price} / {property.nights} night
                {property.nights > 1 ? 's' : ''}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

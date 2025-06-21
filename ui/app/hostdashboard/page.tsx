'use client';

import { useEffect, useState } from "react";
import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";

interface Property {
  _id: string;
  image: string;
  location: string;
  price: number;
  nights: number;
  rating: number;
  description?: string;
  hostId:string;
  booking: { isbooked: boolean, userId: string }
}



export default function HostDashboard() {
  const { session } = useSession();
  const [listings, setListings] = useState<Property[]>([]);
  const [form, setForm] = useState<Partial<Property>>({});
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();


  const fetchListings = async () => {
    if (!session?._id) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/host/${session._id}`);
    const data = await res.json();
    setListings(data.listings || []);
  };

  useEffect(() => {
    if (!session.status || !session.ishost ) router.push("/login")
  }, [])

  useEffect(() => {
    fetchListings();
  }, [session]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    if (!form.image || !form.location || !form.price || !form.nights || !form.rating) {
      alert("Please fill in all required fields.");
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/insertOne`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, hostId: session._id,booking:{isbooked:false,userId:null}}),
    });

    if (res.ok) {
      setForm({});
      setShowModal(false);
      fetchListings();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hostId: session._id }),
    });

    fetchListings();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">🏠 Host Dashboard</h1>

      {/* Add Property Button */}
      <div className="text-right mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
        >
          ➕ Add New Property
        </button>
      </div>

      {/* Listings Section */}
      <h2 className="text-2xl font-semibold mb-4">Your Listings</h2>
      {listings.length === 0 ? (
        <p className="text-gray-500">No properties uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {listings.map((listing) => (
            <div key={listing._id} className="border rounded-xl shadow-md bg-white">
              <img src={listing.image} alt={listing.location} className="w-full h-48 object-cover rounded-t-xl" />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{listing.location}</h3>
                <p className="text-sm text-gray-600">${listing.price} / {listing.nights} nights</p>
                <p className="text-sm text-gray-500 mt-2">{listing.description?.slice(0, 80)}...</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-yellow-500 font-medium">⭐ {listing.rating}</span>
                  <button
                    onClick={() => handleDelete(listing._id)}
                    className="text-sm text-white bg-red-500 hover:bg-red-600 px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
                {listing.booking?.isbooked?<div className="text-green-500" >Booked for {listing.booking?.userId}
                 
                </div>:null}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
            <h2 className="text-2xl font-semibold mb-4">Upload New Property</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="image" value={form.image || ''} onChange={handleInput} placeholder="Image URL*" className="input" />
              <input name="location" value={form.location || ''} onChange={handleInput} placeholder="Location*" className="input" />
              <input name="price" value={form.price || ''} onChange={handleInput} placeholder="Price*" type="number" className="input" />
              <input name="nights" value={form.nights || ''} onChange={handleInput} placeholder="Nights*" type="number" className="input" />
              <input name="rating" value={form.rating || ''} onChange={handleInput} placeholder="Rating*" type="number" step="0.1" className="input" />
              <textarea name="description" value={form.description || ''} onChange={handleInput} placeholder="Description" className="input col-span-1 md:col-span-2" />
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded border border-gray-400 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                Submit
              </button>
            </div>

            {/* Close Button */}
            <button
              className="absolute top-3 right-4 text-xl text-gray-500 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

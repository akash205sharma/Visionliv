'use client';

import { useSession } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface Booking {
  _id: string;
  listingId: {
    image: string;
    location: string;
    price: number;
    nights: number;
  };
  checkIn: string;
  checkOut: string;
  totalAmount: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  ishost: boolean;
  bookings: Booking[];
}

export default function ProfilePage() {
  const { session, updateSession } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Partial<User>>({});
  const hasFetched = useRef(false);

  const router = useRouter();
    
    useEffect(() => {
      if (!session.status) router.push("/login")
    }, [])

  const fetchUser = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/${session._id}`);
    const data = await res.json();
    setUser(data.user);
    updateSession({ ...session, bookings: data.user.bookings, ishost: data.user.ishost })
    setForm({ name: data.user.name, email: data.user.email });
  };

  useEffect(() => {
    if (session?._id && !hasFetched.current) {
      fetchUser();
      hasFetched.current = true;
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${session._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setEditMode(false);
      fetchUser();
    }
  };

  const becomeHost = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/${session._id}/host`, {
      method: 'PATCH',
    });
    if (res.ok) fetchUser();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      {!user ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <div className="space-y-2">
            {editMode ? (
              <>
                <input name="name" value={form.name || ''} onChange={handleInputChange} placeholder="Name" className="border p-2 w-full" />
                <input name="email" value={form.email || ''} onChange={handleInputChange} placeholder="Email" className="border p-2 w-full" />
                <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              </>
            ) : (
              <>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Host:</strong> {user.ishost ? 'Yes' : 'No'}</p>
                <button onClick={() => setEditMode(true)} className="bg-gray-300 px-4 py-2 rounded">Edit</button>
                {!user.ishost && <button onClick={becomeHost} className="bg-green-600 hover:bg-green-400 active:bg-green-500 text-white px-4 py-2 ml-2 rounded">Become a Host</button>}

              </>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

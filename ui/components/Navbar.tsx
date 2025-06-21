"use client"
import React, { useEffect, useRef, useState } from 'react'
import { LogOut, Menu } from 'lucide-react';
import Link from 'next/link';
import { useSession } from '@/context/SessionContext';
import { useRouter } from "next/navigation";

const Navbar = () => {

  const sessionContext = useSession();
  const session = sessionContext?.session;

  const router = useRouter();
  const [menubar, setMenubar] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Detect outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenubar(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const { updateSession } = useSession();

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("Session");

    // Clear context
    updateSession({}); // or use setSession({}) if preferred

    // Clear auth cookie manually (optional)
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect to login or home
    router.push("/login"); // if using next/navigation
  };

  return (
    <div className=' h-20 w-full bg-gray-100 flex justify-between p-5'>
      <Link href={"/"} className='text-4xl text-blue-600 font-bold '> VisionLiv </Link>
      <span ref={menuRef} className='relative font-semibold flex justify-center items-center gap-6'>

        {session.status == "logged" ?
          session.username
          : <Link href={"/login"} className='cursor-pointer hover:bg-gray-200 p-2 hover:rounded-2xl'>Login </Link>
        }
        <div
          onClick={() => setMenubar(true)}
          className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 cursor-pointer"
        >
          <Menu />
        </div>
        {menubar && (
          <div className="absolute top-12 right-0 bg-white text-[15px] shadow-lg rounded-md p-4 w-[150px] z-50">
            {/* Your menu content here */}
            <ul className="space-y-2">
              <li onClick={() => { router.push("/") }} className="hover:text-blue-500 cursor-pointer">Home</li>
              <li onClick={() => { router.push("/profile") }} className="hover:text-blue-500 cursor-pointer">Profile</li>
              <li onClick={() => { router.push("/bookings") }} className="hover:text-blue-500 cursor-pointer">Bookings</li>
              {session.ishost? <li onClick={() => { router.push("/hostdashboard") }} className="hover:text-blue-500  cursor-pointer">Host Dashboard</li>:null}
              {session.status == "logged" ?
                <li onClick={logout} className="hover:text-red-500 cursor-pointer">Logout</li>
                : <li onClick={() => { router.push("/login") }} className="hover:text-red-500 cursor-pointer">Login </li>
              }
            </ul>
          </div>
        )}
      </span>
    </div>
  )
}

export default Navbar



"use client"
import React from 'react'
import { Menu } from 'lucide-react';

const Navbar = () => {
  return (
    <div className='h-20 w-full bg-gray-200 flex justify-between p-5'>
      <div className='text-4xl text-blue-600 font-bold '> VisionLiv </div>
      <span className='text-xl font-semibold flex justify-center items-center gap-4'>
        <div className='cursor-pointer' >Login </div>
        <div className='bg-gray-300 rounded-full p-2 cursor-pointer'> <Menu /></div>
      </span>
    </div>
  )
}

export default Navbar

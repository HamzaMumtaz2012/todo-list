'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const page = () => {
  const [dateInfo, setDateInfo] = useState({
    day: '',
    date: '',
    month: ''
  })

  useEffect(() => {
    const today = new Date()
    
    setDateInfo({
      day: new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today),
      date: new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(today),
      month: new Intl.DateTimeFormat('en-US', { month: 'long' }).format(today)
    })
  }, [])
  const todoes = []

  return (
    <>
      
        <div className='container w-[45vw] border border-[#2b3242] rounded-lg relative mx-auto mt-14'>
          <div className="header flex flex-col gap-1 p-6 px-7 ">
            <samp className='text-[#e0a63d] text-sm'>DAILY WORK ORDER</samp>
            <div className='flex justify-between'>
              <h1 className='text-[1.6rem] font-sans font-semibold'>Tasks</h1>
              <samp className='text-[#5b6478] text-sm'>
                {dateInfo.day && `${dateInfo.day}, ${dateInfo.month} ${dateInfo.date}`}
              </samp>
            </div>

            <div className='flex gap-4 px-1 py-3'>
<div className="flex flex-col">
  <strong className='text-[#e0a63d]'>0</strong>
  <samp className='text-[#5b6478] tracking-wider uppercase'>Open</samp>
</div>
<div className="flex flex-col ">
  <strong className='text-[#5fa88a]'>0</strong>
  <samp className='text-[#5b6478] tracking-wider uppercase'>Done</samp>
</div>
<div className="flex flex-col ">
  <strong className='text-white'>{todoes.length}</strong>
  <samp className='text-[#5b6478] tracking-wider uppercase'>Total</samp>
</div>
            </div>
<div className='h-2 w-[90%] mx-auto rounded-xl bg-[#5b6478]/10'>

</div>
          </div>
          <div className="middle">
            
          </div>
          <div className="Bottom"></div>
        </div>
     
    </>
  )
}

export default page

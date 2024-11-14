import React from 'react'
import Image from 'next/image'

const Top = () => {
  return (
    <div className='z-[5000] bg-black select-none'>
      {/* <Image src="/images/Cardtopline.svg" alt="Logo" width={10} className='w-full' height={10} /> */}
      <div className='bg-gradient-to-r from-black via-[#5A74FF] to-black w-full h-2'></div>
      <div className=' px-4 h-[52px] z-[5000] flex flex-row w-full justify-between items-center'>
        <span className='z-[5000]'>
          <Image src='/images/cross.svg' width={20} height={20} className='' alt='' />
        </span>
        <div className='flex flex-col items-center z-[5000]'>
          <p className='text-[18x] font-bold text-white'>Grow a World</p>
          <p className='text-[13px] text-gray-300'>mini app</p>
        </div>
        <span className='z-[5000]'>
          <Image src='/images/hamburger.svg' width={30} height={30} className='' alt='' />
        </span>
      </div>
    </div>
  )
}

export default Top
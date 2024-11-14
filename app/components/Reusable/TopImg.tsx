import Image from 'next/image'
import React from 'react'
import { useSelector } from 'react-redux'
interface topProp {
  img: string
  amount: string
  style: string
}
const TopImg: React.FC<topProp> = ({ img, style }) => {
  const userData = useSelector((x: any) => x.UsersReducer.currentUser)

  return (
    <div className={`${style} mt-4 select-none`}>
      <div className='flex flex-row items-center gap-1 z-[5000] justify-center '>
        <Image src={img} alt='' width={56} height={58} />
        <p className='font-bold text-[25px] text-[#FFCE00]'>
          {Intl.NumberFormat('en-US').format(userData.balance)}
        </p>
      </div>
    </div>
  )
}

export default TopImg

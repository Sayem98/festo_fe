import Link from 'next/link'
// import { useRouter } from "next/router";
import Image from 'next/image'

import { useSelector } from 'react-redux'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
const NavData = [
  {
    img: '/images/bg/home.png',
    name: 'Home',
    link: '/grow',
  },
  {
    img: '/images/earn.png',
    name: 'Tasks',
    link: '/task',
  },
  {
    img: '/images/frnd2.png',
    name: 'Friends',
    link: '/friend',
  },
  {
    img: '/images/bg/wallet.png',
    name: 'Wallet',
    link: '/exchange',
  },
  {
    img: '/images/bg/dao.png',
    name: 'DAO',
    link: '/',
  },
]
const Footer = () => {
  const user = useSelector((x: any) => x.TaskReducer.user)
  const pathname = usePathname()
  const route = useRouter()
  console.log('route', route)

  return (
    <div className='px-2 flex gap-2 flex-row w-full justify-between fixed bottom-0 pb-2 pt-2 bg-black select-none'>
      {/* <Link href={`/?user=${user}`} className={`flex flex-col items-center border-[1px] rounded-[20px] w-full h-[73px] px-[5px] py-[28px] justify-center text-[gray] bg-black ${pathname==='/' ? 'bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#d0ff008c] to-[#d0ff0017] text-white border-[#CFFF00] o' : 'border-gray-600'}`}>
            <Image src="/images/franchise.svg" alt="/images/franchise.svg" width={25} height={25} />
            <div className="text-[16px]">Franchise</div>
        </Link> */}

      {pathname != '/' &&
        NavData.map((n, i) => {
          const isActive = pathname === n.link
          return (
            <Link
              href={`${n.link}?user=${user}`}
              key={i}
              className={`flex flex-col items-center border-[1px] rounded-[20px] w-full px-[5px] py-[3px] justify-center text-[gray] bg-[#202020]  ${
                isActive
                  ? 'bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#5A74FF] via-[#5a73ff59] to-[#5a73ff00] text-white border-[#5A74FF] o'
                  : 'border-gray-600'
              }`}
            >
              <Image src={n.img} alt={n.name} width={35} height={35} />
              <p className='text-[16px]'>{n.name}</p>
            </Link>
          )
        })}
    </div>
  )
}

export default Footer

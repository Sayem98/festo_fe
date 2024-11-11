import Image from 'next/image'
import React from 'react'
import { TbArrowRight, TbChevronRight } from 'react-icons/tb'
import TopImg from '../Reusable/TopImg'
import Link from 'next/link'

const Friendpage = () => {
    const invitefriend = [
        {
            img: "/images/frnd2.png",
            inv: "Invite a Friend ",
            img2: "/images/bg/coin.png",
            amt: "+50,000",
            you: "for you and your friend"
        },
        {
            img: "/images/frnd2.png",
            inv: "Invite a Friend ",
            img2: "/images/bg/coin.png",
            amt: "+50,000",
            you: "for you and your friend"
        }
    ]
    const list = [
        {
            img: "/images/ton.svg",
            name: "User 1 ",
            img2: "/images/bg/coin.png",
            amt: "100,000",
            level: "Level 2"
        },
        {
            img: "/images/usdt.svg",
            name: "User 3",
            img2: "/images/bg/coin.png",
            amt: "100,000",
            level: "Level 4"
        },
        {
            img: "/images/usdt.svg",
            name: "User 2 ",
            img2: "/images/bg/coin.png",
            amt: "100,000",
            level: "Level 2"
        },
    ]
    return (
        <div className='bg-black h-screen  w-full px-3  select-none'>
            <TopImg
                style='bg-[url(/images/friendbg.svg)] h-[125px] w-full bg-cover rounded-[10px] items-center justify-center flex'
                img='/images/bg/coin.png'
                amount='324,293'
            />
            <div className='flex flex-col gap-3 h-[60vh] overflow-y-scroll'>
                <div className='flex flex-col items-center mt-2'>
                    <p className='text-[20px] text-white font-bold'>Invite a Friend</p>
                    <p className='text-[11px] text-[gray]'>You and your Friend will receive bonuses</p>
                </div>
                <div className='flex flex-col gap-2'>
                    {
                        invitefriend.map((d, i) => (
                            <div key={i} className="w-full  rounded-[12px] px-[24px] py-[2px] bg-[#0C0C0D] border-[1px] border-white border-opacity-20 flex flex-row justify-between items-center">
                                <div className='flex items-center gap-2'>

                                    <Image src={d.img} alt='' width={40} height={37} />
                                    <div className='flex flex-col text-white'>
                                        <p className='text-[17px]'>{d.inv}</p>
                                        <div className='flex flex-row gap-2 items-center' >
                                            <Image src={d.img2} width={25} height={20} alt='' />
                                            <span className='flex flex-row gap-1 items-center'>
                                                <b className='text-[17px]'>{d.amt}</b>
                                                <p className='text-[8px]'>{d.you}</p>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <TbChevronRight className='text-white' />
                            </div>

                        ))
                    }
                </div>

                <div className='flex flex-col gap-3'>
                    <div className='flex flex-col items-start mt-2'>
                        <p className='text-[16px] text-white font-bold'>List of your friends</p>
                    </div>
                    <div className='flex flex-col gap-2'>
                        {
                            list.map((d, i) => (
                                <Link href={"/ranking"} key={i} className="w-full rounded-[12px] px-[24px] py-[2px] bg-[#0C0C0D] border-white border-opacity-20 border-[1px] flex flex-row justify-between items-center">
                                    <div className='flex items-center gap-4'>
                                        <Image src={d.img} alt='' width={40} height={37} />
                                        <div className='flex flex-col text-white'>
                                            <p className='text-[17px]'>{d.name}</p>
                                            <div className='flex flex-row gap-2 items-center' >
                                                <Image src={d.img2} width={25} height={20} alt='' />
                                                <span className='flex flex-row gap-1 items-center'>
                                                    <b className='text-[17px]'>{d.amt}</b>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className='text-white'>{d.level}</p>
                                </Link>
                            ))
                        }
                    </div>
                    <div className='h-[100px]'></div>
                </div>
                
            </div>
            <div className='fixed bottom-24 left-0 w-full'>
                <div className='px-3'>
                    <button className=' bg-[#CFFF00] w-full py-2  rounded-[10px] mt-3 flex items-center justify-center'>
                        <div className='flex flex-row items-center gap-3'>
                            <Image src={"/images/friendicon.svg"} width={35} height={35} alt=''  />
                            <p className='text-[16px]'>INVITE A FRIEND</p>
                        </div>
                    </button>
                </div>
            </div>
            

        </div>
    )
}

export default Friendpage
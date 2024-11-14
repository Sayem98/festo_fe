import React, { useEffect } from 'react'
import TopImg from '../Reusable/TopImg'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/reducers/TaskReducer'
import { setCurrentUser } from '@/redux/reducers/UsersReducer'
import { getUserId } from '@/app/lib/utils'
import instance from '@/app/axios'

const Ranking = () => {
  const dispatch = useDispatch()

  const userFromQuery = (getUserId().user as any)?.id || ''
  const userData = useSelector((x: any) => x.UsersReducer.currentUser)

  const users = useSelector((x: any) => x.UsersReducer.users)

  let myIndex = 0

  useEffect(() => {
    const fetchData = async () => {
      if (userFromQuery) {
        const { data } = await instance.get('/users')
        const item = data.find((item: any) => item.tg_id == userFromQuery)
        dispatch(setUser(item.tg_id))
        dispatch(setCurrentUser(item))
      }
    }

    fetchData()
  }, [])

  return (
    <div className='bg-black h-screen  w-full px-[3%]  select-none'>
      <TopImg
        style='bg-[url(/images/rankingbg.svg)] bg-cover h-[125px] w-full rounded-[10px] items-center justify-center bg-no-repeat flex'
        img='/images/bg/coin.png'
        amount='324,293'
      />

      <div className='h-[70vh] overflow-y-scroll'>
        <div className='w-full border-2 mt-5 rounded-[12px] px-[24px] py-[2px] bg-[#0C0C0D] border-[#2C2C2E] flex flex-row justify-between items-center'>
          <div className='flex items-center gap-4'>
            <Image src={'/images/Frame 43.svg'} alt='' width={40} height={37} />
            <div className='flex flex-col text-white'>
              <p className='text-[17px]'>{userData.username}</p>
              <div className='flex flex-row gap-2 items-center'>
                <Image
                  src={'/images/bg/coin.png'}
                  width={25}
                  height={20}
                  alt=''
                />
                <span className='flex flex-row gap-1 items-center'>
                  <b className='text-[17px]'>
                    {Intl.NumberFormat('en-US').format(userData.mount)}{' '}
                    <span className='text-gray-500'>OTP</span>
                  </b>
                </span>
              </div>
            </div>
          </div>
          <div className='text-white'>{myIndex + 1}</div>
        </div>
        <div className='flex flex-col items-start mt-2'>
          <p className='text-[20px] text-white font-bold'>Ranking</p>
        </div>
        <div className='flex flex-col gap-2 h-[50vh] overflow-y-scroll'>
          <div className='flex flex-col gap-2 min-h-[400px]'>
            {users.map((d: any, i: number) => (
              <div
                key={i}
                className={`w-full border-2 rounded-[12px] px-[24px] py-[2px] bg-[#0C0C0D] border-[#2C2C2E] flex flex-row justify-between items-center`}
              >
                <div className='flex items-center gap-2'>
                  <div className='flex flex-col text-white'>
                    <p className='text-[20px]'>{d.username}</p>
                    <div className='flex flex-row gap-2 items-center'>
                      <span className='flex flex-row gap-1 items-center'>
                        <Image
                          src='/images/bg/coin.png'
                          width={25}
                          height={20}
                          alt=''
                        />

                        <b className='text-[17px] text-white'>
                          {Intl.NumberFormat('en-US').format(
                            d.tg_id == userFromQuery ? userData.mount : d.mount
                          )}
                          <span className=' text-gray-500'> OTP</span>{' '}
                        </b>
                        {/* <p className='text-[13px]'> {d.total_reward} <span className='text-gray-500'>Per Hour</span> </p> */}
                      </span>
                    </div>
                  </div>
                </div>
                {/* <TbChevronRight className='text-white' /> */}
                {/* <Image src={"/images/medal3.svg"} alt='' width={20} height={20} /> */}
                <div className='text-white'>{i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ranking

import React, { useEffect, useState } from 'react'
import TopImg from '../Reusable/TopImg'
import Image from 'next/image'
import { TbChevronRight } from 'react-icons/tb'
import Card from '../common/cardboost'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentUser, setTempMount } from '@/redux/reducers/UsersReducer'
import { useSnackbar } from 'notistack'
import instance from '@/app/axios'

const BoostPage = () => {
  const user = useSelector((x: any) => x.TaskReducer.user)
  const userData = useSelector((x: any) => x.UsersReducer.currentUser)
  const [pointLevel, setPointLevel] = useState<number>(userData.point_level)
  const [energyLevel, setEnergyLevel] = useState<number>(userData.energy_level)
  const dispatch = useDispatch()
  const snackbar = useSnackbar()
  const maxEnergy = 1000 + 500 * energyLevel
  const tempMount = useSelector((x: any) => x.UsersReducer.tempMount)
  const [mount, setMount] = useState<number>(tempMount)
  const [fullEnergy, setFullEnergy] = useState<number>(userData.full_energy)

  useEffect(() => {
    if (mount < maxEnergy) {
      const intervalId = setInterval(() => {
        setMount((prevMount) => Math.min(prevMount + 1, maxEnergy))
        dispatch(setTempMount(mount))
      }, 1500)

      return () => clearInterval(intervalId)
    }
  }, [mount])

  const handleFullEnergy = () => {
    if (fullEnergy > 0) {
      instance
        .post('/fullenergy', {
          user,
        })
        .then(async (response: any) => {
          if (response.data.stats == 'success') {
            const response = await instance.post(`/tgid`, {
              user: user,
            })

            dispatch(setCurrentUser(response.data))
            dispatch(setTempMount(maxEnergy))
            setMount(maxEnergy)
            setFullEnergy(fullEnergy - 1)
            snackbar.enqueueSnackbar(`You charge full energy ${mount}`, {
              autoHideDuration: 1000,
              variant: 'success',
            })
          } else
            snackbar.enqueueSnackbar('failed', {
              autoHideDuration: 1000,
              variant: 'warning',
            })
        })
    } else {
      snackbar.enqueueSnackbar('You need to wait 24 hours for next time', {
        autoHideDuration: 1000,
        variant: 'warning',
      })
    }
  }

  return (
    <div className='bg-black h-screen flex flex-col w-full px-[4%] py-[3%] select-none'>
      <TopImg
        style='bg-[url(/images/bg/back4.png)] bg-no-repeat h-[125px] w-full rounded-[10px] items-center bg-cover justify-center flex'
        amount='324,293'
        img='/images/bg/coin.png'
      />

      <div className='flex flex-col gap-3  overflow-y-scroll'>
        <div className='flex flex-col items-start mt-5'>
          <p className='text-[16px] text-white font-bold '>
            Free daily boosters
          </p>
        </div>
        <div className='flex flex-col gap-2'>
          <div
            onClick={handleFullEnergy}
            className='w-full border-[1px] rounded-[12px] px-[24px] py-4 bg-[#0C0C0D] border-white border-opacity-20 flex flex-row justify-between items-center'
          >
            <div className='flex items-center gap-2'>
              <Image src='/images/aura.png' alt='' width={40} height={40} />
              <div className='flex flex-col text-white '>
                <p className='text-[17px]'>Full energy</p>
                <div className='flex flex-row gap-2 items-center'>
                  <span className='flex flex-row gap-1 items-center'>
                    <p className='text-[14px]'>{fullEnergy}/6 available</p>
                  </span>
                </div>
              </div>
            </div>
            <TbChevronRight className='text-white' />
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          <div className='flex flex-col items-start mt-2'>
            <p className='text-[16px] text-white font-bold'>Boosters</p>
          </div>
          <div className='flex flex-col gap-2'>
            <Card
              title={'Multitap'}
              name={'point_level'}
              level={pointLevel + 1}
              price={1000 * Math.pow(2, pointLevel)}
              img={'/images/hand.png'}
            ></Card>
          </div>
          <div className='flex flex-col gap-2'>
            <Card
              title={'Energy Limit'}
              name={'energy_level'}
              level={energyLevel + 1}
              price={5000 * Math.pow(2, energyLevel)}
              img={'/images/battery.svg'}
            ></Card>
          </div>
          <div className='h-[100px]'></div>
        </div>
      </div>
    </div>
  )
}

export default BoostPage

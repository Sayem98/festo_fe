'use client'
import React, { useState, useEffect, useRef, forwardRef, Ref } from 'react'

import Image from 'next/image'
import Summary from '@/app/components/Reusable/Summary'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { updateItem } from '@/app/lib/api'
import { setCurrentUser, setTempMount } from '@/redux/reducers/UsersReducer'
import { Dialog, DialogContent, DialogContentText, Slide } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import { formattedLevelInfo, getLevelInfo, getUserId } from '@/app/lib/utils'
import { postEvent } from '@telegram-apps/sdk'
const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})
const GrowPage: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [storyOpen, setStoryOpen] = useState(false)
  const handleClose = () => {
    setOpen(false)
  }
  const handleClickOpen = () => {
    setOpen(true)
  }

  const LevelCountArr = [
    0, 100_000, 500_000, 5_000_000, 50_000_000, 500_000_000, 5_000_000_000,
    50_000_000_000, 500_000_000_000, 1_000_000_000_000, 10_000_000_000_000,
  ]

  const user = useSelector((x: any) => x.TaskReducer.user)
  const userData = useSelector((x: any) => x.UsersReducer.currentUser)
  const tempMount = useSelector((x: any) => x.UsersReducer.tempMount)

  const [energyLevel, setEnergyLevel] = useState<number>(userData.energy_level)
  const [count, setCount] = useState<number>(Number(userData.mount || 0))
  const [balance, setBalance] = useState<number>(Number(userData.balance || 0))
  const [stepAmount, setStepAmount] = useState<number>(
    getLevelInfo(userData.mount)?.number + userData.point_level
  )
  const [tempCount, setTempCount] = useState<number>(stepAmount)

  const maxEnergy = 1000 + 500 * energyLevel
  const dispatch = useDispatch()

  const [mount, setMount] = useState<number>(tempMount)

  const [animations, setAnimations] = useState<
    { id: number; x: number; y: number }[]
  >([])

  let animationId = 0
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [pulses, setPulses] = useState([])
  const userFromQuery = (getUserId().user as any)?.id || ''

  let level = getLevelInfo(userData.mount)?.number || 1
  let currentLevelCount = LevelCountArr[level - 1]
  let nextLevelCount = LevelCountArr[level]
  let currentPercent =
    ((count - currentLevelCount) * 100) / (nextLevelCount - currentLevelCount)

  const handleIncrement = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    let payload: any = [...pulses]
    payload.push(0)
    setPulses(payload)

    if (mount <= stepAmount) return

    if ('touches' in event) {
      const touches = Array.from(event.touches)
      touches.forEach((touch) => {
        setAnimations((prev) => [
          ...prev,
          { id: animationId++, x: touch.clientX, y: touch.clientY },
        ])
        const newCount = count + (stepAmount || 0)
        const newBalance = +balance + (stepAmount || 0)
        setCount(newCount)
        setBalance(Number(newBalance))
        setMount(mount - stepAmount)
        setTempCount(tempCount + stepAmount)
        dispatch(setTempMount(mount))
        const temp = {
          id: userData.id,
          tg_id: userData.tg_id,
          mount: newCount,
          balance: newBalance,
          point_level: userData.point_level,
          energy_level: userData.energy_level,
          total_reward: userData.total_reward,
          friend_ids: userData.friend_ids,
          public_key: userData.publickey,
          private_key: userData.privatekey,
          date: userData.date,
          energy: userData.energy,
          full_energy: userData.full_energy,
          odp: userData.odp,
          rate_date: userData.rate_date,
        }
        dispatch(setCurrentUser(temp))
      })
    } else {
      setAnimations((prev) => [
        ...prev,
        { id: animationId++, x: event.clientX, y: event.clientY },
      ])
      const newCount = count + (stepAmount || 0)
      const newBalance = balance + (stepAmount || 0)
      setCount(newCount)
      setBalance(Number(newBalance))
      setMount(mount - stepAmount)
      setTempCount(tempCount + stepAmount)
      dispatch(setTempMount(mount))
    }

    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }
    updateTimeoutRef.current = setTimeout(async () => {
      try {
        if (user) {
          updateItem(user, tempCount, tempCount)
          setTempCount(0)
        }
      } catch (error) {
        console.error('Failed to update item', error)
      }

      setAnimations([])
    }, 2000)
  }

  useEffect(() => {
    if (mount < maxEnergy) {
      const intervalId = setInterval(() => {
        setMount((prevMount) => Math.min(prevMount + 1, maxEnergy))
      }, 1500)
      return () => clearInterval(intervalId)
    }
  }, [mount])
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setBalance(+userData?.balance)
      }
    }
    fetchData()
  }, [userData])

  return (
    <div className='bg-[url(/images/bg/bg2.png)] bg-no-repeat h-screen bg-cover bg-center px-2 relative h-1200px select-none'>
      <div className='h-[20vh] flex flex-col justify-between'>
        <div className='pt-3 flex flex-row items-center gap-[5%]'>
          <Link href={'/rank'}>
            <Image src={'/images/friends.png'} height={60} width={60} alt='' />
          </Link>
          <div className='w-full flex flex-col gap-2 '>
            <div className='flex flex-row w-full justify-between items-center'>
              <span className='flex flex-row items-center gap-2'>
                <Image src={'/images/cup.svg'} height={20} width={20} alt='' />
                <div
                  className='flex flex-row items-center'
                  onClick={handleClickOpen}
                >
                  <p className='text-[14px] text-white select'>
                    {getLevelInfo(count)?.text} {'>'}
                  </p>
                </div>
              </span>
              <span className='flex flex-row items-center gap-2'>
                <Image
                  src={'/images/network.svg'}
                  height={20}
                  width={20}
                  alt=''
                />
                <p className='text-[14px] text-white'>
                  Level {getLevelInfo(count)?.number}/10{' '}
                </p>
              </span>
            </div>
            <div className='relative h-[12px] bg-[#202020] rounded-[30px] w-full p-[1px] border-[#CFFF00] border-[1px] border-opacity-60'>
              <div
                className={` h-full rounded-[30px] z-50 bg-gradient-to-tr from-[#CFFF00] via-[#91D097] to-[#2441A8]`}
                style={{ width: `${currentPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
        <Summary />
      </div>
      <div className='flex py-4 w-full h-[70vh]  pb-90 mb-10  absolute bottom-0 bg-gradient-to-b from-[#1a1c22a4] to-[#000000a4] backdrop-blur-sm rounded-t-[32px] left-0 border-t-2 border-[#5A74FF] backbl overflow-y-scroll'>
        <div className='min-h-[450px] w-full flex flex-col justify-between'>
          {/* <div className='flex bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#5a73ff69] via-[#5a73ff00] to-[#5a73ff00] inset-0 top-0 absolute rounded-t-[32px] '></div> */}
          <div className='flex flex-row items-center gap-1 z-[5000] justify-center relative'>
            <Image
              className='rorating-circle'
              src='/images/bg/coin.png'
              alt=''
              width={40}
              height={58}
            />
            <div className=''>
              <span className='opacity-50 text-[20px] text-white font-bold text-center '>
                OTP
              </span>
              <p className='font-bold text-[25px] text-white text-center'>
                {Intl.NumberFormat('en-US').format(balance)}{' '}
              </p>
            </div>
          </div>
          <div
            className='w-full flex items-center justify-center z-[5000] relative button'
            onTouchStart={handleIncrement}
          >
            <div className='rotating-circle ' />

            <AnimatePresence>
              {animations.map((animation, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, y: -100, x: -50, scale: 0.5 }}
                  animate={{ opacity: 0, y: -400, x: -50, scale: 0.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className='select-none font-medium text-[20px] text-white touch-none flex items-center'
                  style={{
                    position: 'fixed',
                    left: `${animation.x}px`,
                    top: `${animation.y}px`,
                  }}
                >
                  <Image
                    src='/images/bg/coin.png'
                    alt=''
                    width={80}
                    height={80}
                  />
                  +{stepAmount}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className='px-5 flex w-full flex-row justify-between z-[5000]'>
            <div className='flex flex-row items-center gap-2'>
              <Image src='/images/battery.svg' alt='' width={40} height={40} />
              <p className='text-[14px] text-white'>
                {mount || 0}/{maxEnergy || 0}
              </p>
            </div>
            <Link
              href={`/build?user=${userFromQuery}`}
              className='flex flex-row items-center gap-2'
            >
              <Image src='/images/store.png' alt='' width={40} height={40} />
              <p className='text-[14px] text-white'>Store</p>
            </Link>
            <Link
              href={`/boosts?user=${userFromQuery}`}
              className='flex flex-row items-center gap-2'
            >
              <Image src='/images/boost.png' alt='' width={40} height={40} />
              <p className='text-[14px] text-white'>Boost</p>
            </Link>
          </div>
          <div className='w-full flex items-center justify-center h-6'></div>
        </div>
      </div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
        sx={{ backdropFilter: 'blur(19px)' }}
      >
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>
            <img
              className='absolute top-[21px] right-[27px] cursor-pointer'
              onClick={handleClose}
              src='/images/close.svg'
            />
            <span className='flex flex-col text-center gap-3 mt-8'>
              {formattedLevelInfo.map((item, i) => (
                <div
                  key={i}
                  className={`mt-[10px] text-[20px] leading-[14px]  flex justify-between ${
                    item.level == level ? 'text-cyan-400' : 'text-[white]'
                  }`}
                >
                  <div>
                    Level {item.level} {'('}
                    {item.label}
                    {')'} :
                  </div>
                  <div>{item.amount}</div>
                </div>
              ))}

              <span className='flex justify-center mt-[29.08px]'>
                <button
                  className='px-4 h-[82px] font-semibold text-[24px] bg-[#CFFF00] text-black rounded-[16px] transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed w-full'
                  onClick={handleClose}
                >
                  OK
                </button>
              </span>
            </span>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      {/* <Dialog
        keepMounted
        open={storyOpen}
        TransitionComponent={Transition}
        onClose={() => setStoryOpen(false)}
        aria-describedby='alert-dialog-slide-description'
        sx={{ backdropFilter: 'blur(19px)' }}
      >
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>
            <img
              className='absolute top-[21px] right-[27px] cursor-pointer'
              onClick={() => setStoryOpen(false)}
              src='/images/close.svg'
            />
            <span className='flex flex-col text-center'>
              <h1 className='text-white text-5xl mb-8'>Congrats</h1>
              <p className='mb-6 text-white'>New Achievement</p>
              <button
                onClick={sendStory}
                className='bg-white py-2 px-4 rounded-2xl'
              >
                Share your results{' '}
              </button>
            </span>
          </DialogContentText>
        </DialogContent>
      </Dialog> */}
    </div>
  )
}
export default GrowPage

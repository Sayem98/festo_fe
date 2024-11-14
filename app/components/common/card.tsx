'use Client'

import React, { Ref, forwardRef, useRef, useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import { useSnackbar } from 'notistack'
import { useDispatch, useSelector } from 'react-redux'
import '../../globals.css'
import Image from 'next/image'
import { IoMdCheckmark } from 'react-icons/io'
import { TbChevronRight } from 'react-icons/tb'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import {
  setCurrentUser,
  setShowAchievement,
} from '@/redux/reducers/UsersReducer'
import { getLevelInfo, getUserId } from '@/app/lib/utils'
import { setTasks } from '@/redux/reducers/TaskReducer'
import instance from '@/app/axios'
interface CardProps {
  title: string
  description?: String
  price: string
  link: string
  img: string
  status: '' | 'pending' | 'completed'
  onLoad: () => void
  taskId: string
}

export const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

function Card({
  title,
  description,
  price,
  link,
  img,
  status,
  taskId,
}: CardProps) {
  const user = (getUserId().user as any)?.id
  const snackbar = useSnackbar()
  const [open, setOpen] = useState(false)
  const [doing, setDoing] = useState(false)
  const [done, setDone] = useState(status === 'completed')
  const forceRef = useRef(null)
  const dispatch = useDispatch()
  const currentUser = useSelector(
    (state: any) => state.UsersReducer.currentUser
  )

  const updateTasks = async () => {
    const { data } = await instance.get(`/tasks/${user || '404'}`)
    dispatch(setTasks(data))
  }

  const handleClickOpen = () => {
    if (!done) {
      setOpen(true)
    }
  }

  const handleClose = () => {
    if (!doing) {
      setOpen(false)
    }
  }

  const handleBonus = () => {
    setDoing(true)
    instance
      .post('/bonus', {
        user,
        title,
        price,
      })
      .then(async (response: any) => {
        if (response.data.status == 'success') {
          const response = await instance.post(`/tgid`, {
            user: user,
          })

          await instance.post('/tasks/' + taskId, {
            status: 'completed',
          })
          await updateTasks()
          if (
            getLevelInfo(currentUser.balance)?.text !==
            getLevelInfo(response.data.balance)?.text
          ) {
            dispatch(setShowAchievement(true))
          }
          dispatch(setCurrentUser(response.data))
          snackbar.enqueueSnackbar(
            `You gain ${price} coins.  Your balance is ${response.data.mount}`,
            { autoHideDuration: 1000, variant: 'success' }
          )
        } else
          snackbar.enqueueSnackbar('You need to wait 24 hours for next time', {
            autoHideDuration: 1000,
            variant: 'warning',
          })

        setOpen(false)
        setDoing(false)
        setOpen(false)
        setDoing(false)
        setDone(true)
      })
      .catch((err) => {
        console.log(err)
        setDoing(false)
        setOpen(false)
        snackbar.enqueueSnackbar('Something went wrong', {
          autoHideDuration: 1000,
          variant: 'error',
        })
      })
    // const response = {
    //   data: {
    //     balance: 5_000_000,
    //     mount: 5_000_000,
    //   },
    // }
    // if (
    //   getLevelInfo(currentUser.balance)?.text !==
    //   getLevelInfo(response.data.balance)?.text
    // ) {
    //   dispatch(setShowAchievement(true))
    // }
    // dispatch(setCurrentUser(response.data))

    // setDoing(false)
  }
  const startBonus = () => {
    setDoing(true)
    instance
      .post('/tasks/' + taskId, {
        status: 'pending',
      })
      .then(async () => {
        await updateTasks()
        ;(forceRef?.current as any).click()
        setDoing(false)
        setOpen(false)
      })
      .catch((err) => {
        console.log(err)
        setDoing(false)
      })
  }

  return (
    <>
      <div
        className='select-none w-full border-[1px] border-white border-opacity-20 rounded-[12px] px-4 py-[2px] bg-[#0C0C0D] flex flex-row justify-between gap-x-2 items-center '
        onClick={handleClickOpen}
      >
        <div className='py-2 gap-4 flex items-center'>
          <div className=' rounded-lg'>
            <Image
              src={img}
              alt=''
              width={40}
              height={40}
              className='rounded-lg'
            />
          </div>
          <div className='flex flex-col text-white'>
            <p className='text-[14px]'> {title}</p>
            <div className='flex flex-row gap-2 items-center'>
              <span className='flex flex-row items-center'>
                <Image
                  src='/images/bg/coin.png'
                  width={20}
                  height={20}
                  alt=''
                />
                <b className='text-[17px]'>
                  +{Intl.NumberFormat('en-US').format(Number(price))}
                </b>
              </span>
            </div>
          </div>
        </div>
        {status === 'completed' && <IoMdCheckmark className='text-white' />}
        {status === 'pending' && (
          <AiOutlineLoading3Quarters className='text-white' />
        )}
        {status === '' && <TbChevronRight className='text-white' />}
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
            <span className='flex flex-col text-center'>
              <Image
                src={img}
                alt='mexc'
                className='w-[114px] h-[114px] self-center'
                height={114}
                width={114}
              />
              <span className='mt-[35px] font-semibold text-[32px] leading-[32px] text-[#CFFF00]'>
                {title}
              </span>
              <span className='mt-[17px] font-medium text-[14px] leading-[14px] text-[#6E6E6E]'>
                {description}
              </span>
              <a
                ref={forceRef}
                className='text-black opacity-0'
                target='_blank'
                href={'https://redirect-five-kohl.vercel.app?link=' + link}
              >
                dd
              </a>
              <span className='mt-[61px] font-semibold text-[16px] leading-[16px] text-[#6E6E6E]'>
                Reward
              </span>
              <span className='flex justify-center space-x-[10.61px] items-center mt-[18.5px] font-bold text-[29px] leading-[29px] text-[#CFFF00]'>
                <img
                  src='/images/bg/coin.png'
                  alt='dollar'
                  className='w-[31.84px] h-[31.84px]'
                />
                <div>+{Intl.NumberFormat('en-US').format(Number(price))}</div>
              </span>
              <span className='flex justify-center mt-[29.08px]'>
                <button
                  className='px-4 h-[82px] font-semibold text-[24px] bg-[#CFFF00] text-black rounded-[16px] transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed w-full'
                  onClick={() => {
                    status === 'pending' ? handleBonus() : startBonus()
                  }}
                  disabled={doing}
                >
                  {
                    {
                      '': 'Start Task',
                      pending: 'Get Reward',
                      completed: 'Done',
                    }[status]
                  }
                  {/* {status === 'completed' ? 'Get Reward' : 'Start Task'} */}
                </button>
              </span>
            </span>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Card

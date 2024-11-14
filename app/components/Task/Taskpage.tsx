import TopImg from '../Reusable/TopImg'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card, { Transition } from '@/app/components/common/card'
import { useSnackbar } from 'notistack'
import Image from 'next/image'
import { TbChevronRight } from 'react-icons/tb'
import { postEvent } from '@telegram-apps/sdk-react'
import { updateItem } from '@/app/lib/api'
import { setCurrentUser } from '@/redux/reducers/UsersReducer'
import { getUserId } from '@/app/lib/utils'
import { Dialog, DialogContent, DialogContentText } from '@mui/material'
import instance from '@/app/axios'

const TaskPage = () => {
  const [open, setOpen] = useState(false)
  const allTasks = useSelector((x: any) => x.TaskReducer.tasks)
  const mainTasks = allTasks?.filter((x: any) => x.extra === false)
  // const mainTasks = [
  //   {
  //     title: 'Task 1',
  //     description: 'Description 1',
  //     price: '5000',
  //     link: 'https://google.com',
  //     img: '/images/wallet.png',
  //     status: 'pending',
  //   },
  // ]
  const user = useSelector((x: any) => x.TaskReducer.user)
  const userData = useSelector((x: any) => x.UsersReducer.currentUser)
  const snackbar = useSnackbar()
  const dispatch = useDispatch()
  const handleImageLoad = () => {}

  const [showHour, setShowHour] = useState<number>(0)
  const [showMinute, setShowMinute] = useState<number>(0)
  const [showSecond, setShowSecond] = useState<number>(0)

  const daily = [
    {
      img: '/images/wallet.png',
      inv: 'Daily reward',
      img2: '/images/bg/coin.png',
      amt: 5000,
    },
  ]

  const handleReward = async () => {
    const delta: Date = userData.date
    const lastTime = new Date(delta).getTime()
    const currentTime = new Date().getTime()
    if (currentTime - lastTime >= 86400000) {
      await instance.post(`/date`, {
        user: user,
      })
      await updateItem(user, 5000, 5000)
      const response2 = await instance.post(`/tgid`, {
        user: user,
      })

      dispatch(setCurrentUser(response2.data))
      snackbar.enqueueSnackbar(`You got 5000`, {
        autoHideDuration: 1000,
        variant: 'success',
      })
      setOpen(true)
    } else {
      const h = Math.floor((lastTime + 86400000 - currentTime) / 1000 / 60 / 60)

      snackbar.enqueueSnackbar(`You need to wait for ${h + 1} hours`, {
        autoHideDuration: 1000,
        variant: 'error',
      })
    }
  }
  const delta: Date = userData.date
  const lastTime = new Date(delta).getTime()
  const currentTime = new Date().getTime()
  const h = Math.floor((lastTime + 86400000 - currentTime) / 1000 / 60 / 60)
  const m = Math.floor(
    (lastTime + 86400000 - currentTime - h * 3600000) / 1000 / 60
  )
  const s = Math.floor(
    (lastTime + 86400000 - currentTime - h * 3600000 - m * 60000) / 1000
  )

  const sendStory = () => {
    postEvent('web_app_share_to_story' as any, {
      media_url: 'https://i.ibb.co/dKxXRGg/logo.png',
      text: `I am using this app to earn money. Join me! @test_1231312312321321321321_bot/start?=${
        (getUserId().user as any).id
      }`,
    })
    setOpen(false)
  }
  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (currentTime - lastTime <= 86400000) {
      const intervalId = setInterval(() => {
        setShowHour(h)
        setShowMinute(m)

        setShowSecond(s)
      }, 1000)

      return () => clearInterval(intervalId)
    }
  }, [showSecond])

  return (
    <div className='bg-black flex flex-col w-full px-3 select-none'>
      <TopImg
        style='bg-[url(/images/bg/back2.png)] bg-no-repeat h-[125px] w-full rounded-[10px] items-center bg-cover justify-center flex'
        amount='324,293'
        img='/images/bg/coin.png'
      />

      <div className='flex flex-col gap-3 h-[80vh] overflow-y-scroll'>
        <div className='flex flex-col items-start mt-5 '>
          <p className='text-[16px] text-white font-bold'>Daily tasks</p>
        </div>
        <div className='text-red-500'>
          {showHour}h:{showMinute}m:{showSecond}s
        </div>
        <div className='flex flex-col gap-2'>
          {daily.map((d, i) => (
            <div
              key={i}
              className='w-full border-[1px] border-white border-opacity-20 rounded-[12px] px-4 py-2 bg-[#0C0C0D] flex flex-row justify-between items-center'
              onClick={handleReward}
            >
              <div className='flex items-center gap-2 '>
                <Image src={d.img} alt='' width={50} height={50} />
                <div className='flex flex-col text-white'>
                  <p className='text-[17px]'>{d.inv}</p>
                  <div className='flex flex-row gap-2 items-center'>
                    <span className='flex flex-row items-center'>
                      <Image src={d.img2} width={20} height={20} alt='' />
                      <b className='text-[17px]'>
                        +{Intl.NumberFormat('en-US').format(d.amt)}
                      </b>
                    </span>
                  </div>
                </div>
              </div>
              <TbChevronRight className='text-white' />
            </div>
          ))}
        </div>
        <div className='flex flex-col items-start mt-2'>
          <p className='text-[16px] text-white font-bold'>Tasks list</p>
        </div>
        <div className=' flex flex-col gap-y-2 pb-[120px] text-white  bg-black h-full overflow-auto'>
          {mainTasks.map((x: any, i: number) => (
            <Card
              key={i}
              title={x.title}
              description={x.description}
              price={x.price}
              link={x.link}
              img={x.img}
              onLoad={handleImageLoad}
              status={x.status}
              taskId={x.task_id}
            />
          ))}
        </div>
      </div>

      <Dialog
        keepMounted
        open={open}
        TransitionComponent={Transition}
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
              <h1 className='text-white text-5xl mb-8'>Congrats</h1>
              <p className='mb-6 text-white'>You got 5000</p>
              <button
                onClick={sendStory}
                className='bg-white py-2 px-4 rounded-2xl'
              >
                Share your results{' '}
              </button>
            </span>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TaskPage

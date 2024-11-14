import { getUserId } from '@/app/lib/utils'
import { setShowAchievement } from '@/redux/reducers/UsersReducer'
import { Dialog, DialogContent, DialogContentText, Slide } from '@mui/material'
import { postEvent } from '@telegram-apps/sdk'
import { TransitionProps } from 'notistack'
import React, { forwardRef, Ref, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

function ShareStoryProvider({ children }: any) {
  const [storyOpen, setStoryOpen] = React.useState(false)
  const showAchievement = useSelector((x: any) => x.UsersReducer)
  const snackbar = useSnackbar()
  const dispatch = useDispatch()
  const sendStory = () => {
    try {
      postEvent('web_app_share_to_story' as any, {
        media_url: 'https://i.ibb.co/dKxXRGg/logo.png',
        text: `I am using this app to earn money. Join me! @test_1231312312321321321321_bot/start?=${
          (getUserId().user as any).id
        }`,
      })
      setStoryOpen(false)
      dispatch(setShowAchievement(false))
    } catch (error) {
      snackbar.enqueueSnackbar('Failed to share story', {
        autoHideDuration: 1000,
        variant: 'error',
      })
    }
  }

  const handleClose = () => {
    setStoryOpen(false)
    dispatch(setShowAchievement(false))
  }

  useEffect(() => {
    if (showAchievement.showAchievement) {
      setStoryOpen(true)
    }
  }, [showAchievement])

  return (
    <>
      {children}
      <Dialog
        keepMounted
        open={storyOpen}
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
      </Dialog>
    </>
  )
}

export default ShareStoryProvider

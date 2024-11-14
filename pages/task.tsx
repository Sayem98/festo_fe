'use client'
import React, { useState, useEffect, useRef } from 'react'

import TaskPage from '@/app/components/Task/Taskpage'
import { useDispatch, useSelector } from 'react-redux'
import { setTempMount } from '@/redux/reducers/UsersReducer'

const Build: React.FC = () => {
  const userData = useSelector((x: any) => x.UsersReducer.currentUser)
  const tempMount = useSelector((x: any) => x.UsersReducer.tempMount)
  const [mount, setMount] = useState<number>(tempMount)
  const [energyLevel, setEnergyLevel] = useState<number>(userData.energy_level)
  const maxEnergy = 1000 + 500 * energyLevel
  const dispatch = useDispatch()
  useEffect(() => {
    if (mount < maxEnergy) {
      const intervalId = setInterval(() => {
        setMount((prevMount) => Math.min(prevMount + 1, maxEnergy))
        dispatch(setTempMount(mount))
      }, 1500)

      return () => clearInterval(intervalId)
    }
  }, [mount])
  return <TaskPage />
}
export default Build

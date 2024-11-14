'use client'
import React, { useState, useEffect, useRef } from 'react'

import BuildPage from '@/app/components/Build/Buildpage'
import { useDispatch, useSelector } from 'react-redux'
import { setTempMount } from '@/redux/reducers/UsersReducer'
// const LEVEL_STEP = 5000;

const Build: React.FC = () => {
  const userdata = useSelector((x: any) => x.UsersReducer.currentUser)
  const tempMount = useSelector((x: any) => x.UsersReducer.tempMount)
  const [mount, setMount] = useState<number>(tempMount)
  const [energyLevel, setEnergyLevel] = useState<number>(userdata.energy_level)
  const maxEnergy = 1000 + 500 * energyLevel
  const dispatch = useDispatch()
  useEffect(() => {
    if (mount < maxEnergy) {
      const intervalId = setInterval(() => {
        setMount((prevMount) => Math.min(prevMount + 1, maxEnergy))
        dispatch(setTempMount(mount))
        console.log('--------mount--------', mount)
      }, 1500)

      return () => clearInterval(intervalId)
    }
  }, [mount])
  return <BuildPage />
}
export default Build

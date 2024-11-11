"use client"
import React, { useState, useEffect, useRef } from 'react';

import Taskpage from '@/app/components/Task/Taskpage';
import { useDispatch, useSelector } from 'react-redux';
import { setTempMount } from '@/redux/reducers/UsersReducer';
// const LEVEL_STEP = 5000;

const Build: React.FC = () => {
    const userdata = useSelector((x:any) => x.UsersReducer.currentUser);
    const tempMount = useSelector((x:any) => x.UsersReducer.tempMount);
    const [mount, setMount] = useState<number>(tempMount);
    const [energyLevel, setEnergyLevel] = useState<number>(userdata.energy_level);
    const maxEnergy = 1000 + 500*energyLevel;
    const dispatch = useDispatch();
    useEffect(() => {
        if (mount < maxEnergy) {
        const intervalId = setInterval(() => {
            setMount((prevMount) => Math.min(prevMount + 1, maxEnergy)); // Ensure mount doesn't exceed 1000
            dispatch(setTempMount(mount));
            console.log("--------mount--------",mount)
        }, 1500); // Adjust the interval as needed

        return () => clearInterval(intervalId); // Clean up the interval on unmount

        }
    }, [mount]);
    return(
        <Taskpage/>
    )
}
export default Build;

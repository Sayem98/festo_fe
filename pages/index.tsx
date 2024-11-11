"use client"
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Summary from '@/app/components/Reusable/Summary';
import Link from 'next/link';
import { useRouter } from "next/router";
import axios from "@/app/axios";

import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/reducers/TaskReducer";
import { setCurrentUser, setTempMount } from '@/redux/reducers/UsersReducer';

export default function Home() {
  const [progress, setProgress] = useState(0);
  // const dispatch = useDispatch();
  const router = useRouter();
  const userFromQuery = router.query.user?.toString() || "";
  const userdata = useSelector((x:any) => x.UsersReducer.currentUser);

  const [energyLevel, setEnergyLevel] = useState<number>(userdata.energy_level);
  const maxEnergy = 1000 + 500*energyLevel;
  const dispatch = useDispatch();
  dispatch(setTempMount(maxEnergy));
  

  useEffect(() => {
    if (userFromQuery) {
      const func = async () => {
        const { data } = await axios.post(
          "https://tongym-be-ekfd.onrender.com/users",
          {
            user: userFromQuery,
          }
        );
        console.log("sdfsdf111------------",data.user);

        dispatch(setUser(data.user));
        const response = await axios.post(
          `https://tongym-be-ekfd.onrender.com/tgid`,
          {
            user: userFromQuery,
            
          }
        );
        console.log("sdfsdf222------------",response.data);
        dispatch(setCurrentUser(response.data));
      };
      func();
    }
  }, [userFromQuery]);
  // useEffect(() => {
  //   if (userFromQuery) {
  //     const func = async () => {
  //       const { data } = await axios.get(
  //         `https://tongym-be-ekfd.onrender.com/users?id=${userFromQuery}`,
          
  //       );
  //       dispatch(setCurrentUser(data));
  //     };
  //     func();
  //     // alert({data});
  //   }
  // }, [userFromQuery]);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 10) {
          clearInterval(interval);
          router.push(`/grow/?user=${userFromQuery}`);
          return oldProgress;
        }
        return Math.min(oldProgress + 10, 100);
      });
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [router]);
  
  return (
    <div className="bg-[url(/images/bg/bg2.png)] z-20  relative overflow-y-hidden z-20 bg-no-repeat bg-cover h-screen w-full">
      <div className=' h-[100vh]'>
        <div className="h-[70vh] flex flex-col justify-center items-center ">
          
            
          <Image src='/images/bg/logo.png' alt='' width={300} height={300} className="z-[5000] rounded-lg" />
          
          <div className="flex flex-col items-center absolute bottom-[12%] z-[5000]">
            <p className="text-[gray]">Stay tuned</p>
            <p className="text-[18px] font-bold text-white w-[80%] text-center">
              More info in official channels
            </p>
            <div className="w-full flex justify-center z-[5000] items-center py-5">
              <div className="w-[137px] z-[5000] h-[5px] bg-[#37383D] rounded-[8px]">
                <div
                  className="h-[5px] bg-gradient-to-tr from-[#fff] to-[#CFFF00] rounded-[8px]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <div className="flex flex-row items-center gap-3 mt-3">
              <Link
                href="https://t.me/ocicatcoin"
                className="h-[47px] w-[47px] rounded-full flex items-center justify-center bg-[#161616] border-[#2C2C2E] border-2"
              >
                <Image src="/images/telegram1.svg" width={21} height={19} alt="" />
              </Link>
              <Link
                href="https://x.com/ocicatcoin"
                className="h-[47px] w-[47px] rounded-full flex items-center justify-center bg-[#161616] border-[#2C2C2E] border-2"
              >
                <Image src="/images/subtract1.svg" width={21} height={19} alt="" />
              </Link>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}



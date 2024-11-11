
import TopImg from '../Reusable/TopImg'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { TbChevronRight } from 'react-icons/tb'
import { IoMdCheckmark } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";        
import Card from "@/app/components/common/card";
import axios from 'axios';
import { updateItem } from '@/app/lib/api';
import { useSnackbar } from "notistack";
import { current } from '@reduxjs/toolkit';
import { setCurrentUser } from '@/redux/reducers/UsersReducer';
const Taskpage = () => {
    const allTasks = useSelector((x: any) => x.TaskReducer.tasks)
    const mainTasks = allTasks?.filter((x: any) => x.extra === false)
    const user = useSelector((x: any) => x.TaskReducer.user);
    const userData = useSelector((x:any) => x.UsersReducer.currentUser);
    const snackbar = useSnackbar();
    const dispatch = useDispatch();
    const handleImageLoad = () => {
      // setImagesLoaded((prev) => {
      //     console.log(prev)
      //     const newCount = prev + 1;
      //     console.log(newCount)
      //     if (newCount === totalImages) {
      //         setLoading(false);
      //     }
      //     return newCount;      
      // });
    };
    console.log(userData);
    const [showhour, setShowhour] = useState<number>(0);
    const [showminute, setShowminute] = useState<number>(0);
    const [showsecond, setShowsecond] = useState<number>(0);
    const daily = [
        {
            img: "/images/wallet.png",
            inv: "Daily reward",
            img2: "/images/bg/coin.png",
            amt: 5000,
        },

    ]
    const handleReward = async() => {
        const delta:Date = userData.date;
        const lastTime = (new Date(delta)).getTime();
        const currentTime = (new Date()).getTime();
        console.log(new Date());//86400000
        if((currentTime-lastTime)>=86400000){
            const response = await axios.post(
                `https://tongym-be-ekfd.onrender.com/date`,
                {
                  user:user,
                  
                }
            );
            const response1 = await updateItem(user, 5000, 5000);
            console.log(response1.user===user);
            const response2 = await axios.post(
                `https://tongym-be-ekfd.onrender.com/tgid`,
                {
                  user: user,
                  
                }
              );
              // dispatch(useSelector())response.data;
              dispatch(setCurrentUser(response2.data));
              snackbar.enqueueSnackbar(
                `You got 5000`,
                { autoHideDuration: 1000, variant: 'success' }
              );

        }
        else {
            const h = Math.floor((lastTime + 86400000 - currentTime)/1000/60/60);
            
            snackbar.enqueueSnackbar(
                `You need to wait for ${h+1} hours`,
                { autoHideDuration: 1000, variant: 'error' }
              );
        }

    }
    const delta:Date = userData.date;
    const lastTime = (new Date(delta)).getTime();
    const currentTime = (new Date()).getTime();
    const h = Math.floor((lastTime + 86400000 - currentTime)/1000/60/60);
    const m = Math.floor((lastTime + 86400000 - currentTime-h*3600000)/1000/60);
    const s = Math.floor((lastTime + 86400000 - currentTime-h*3600000-m*60000)/1000);
    useEffect(() => {
      
      
        if ((currentTime-lastTime)<=86400000) {
          const intervalId = setInterval(() => {
  
  
            setShowhour(h);
            setShowminute(m);
  
            setShowsecond(s);
  
          }, 1000); // Adjust the interval as needed
    
          return () => clearInterval(intervalId); // Clean up the interval on unmount
        }
      }, [showsecond]);
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
                <div className='text-red-500'>{showhour}h:{showminute}m:{showsecond}s</div>
                <div className='flex flex-col gap-2'>
                    {
                        daily.map((d, i) => (
                            <div key={i} className="w-full border-[1px] border-white border-opacity-20 rounded-[12px] px-4 py-2 bg-[#0C0C0D] flex flex-row justify-between items-center" onClick={handleReward}>
                                <div className='flex items-center gap-2 '>
                                    <Image src={d.img} alt='' width={50} height={50} />
                                    <div className='flex flex-col text-white'>
                                        <p className='text-[17px]'>{d.inv}</p>
                                        <div className='flex flex-row gap-2 items-center' >
                                            <span className='flex flex-row items-center'>
                                                <Image src={d.img2} width={20} height={20} alt='' />
                                                <b className='text-[17px]'>+{Intl.NumberFormat('en-US').format(d.amt)}</b>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <TbChevronRight className='text-white' />
                                {/* <div className='w-[25px] h-[25px] bg-green-500 rounded-full items-center justify-center flex'><IoMdCheckmark/></div> */}
                            </div>
                        ))
                    }
                </div>
                <div className='flex flex-col items-start mt-2'>
                    <p className='text-[16px] text-white font-bold'>Tasks list</p>
                </div>
                <div className=" flex flex-col gap-y-2 pb-[120px] text-white  bg-black h-full overflow-auto">
                    {mainTasks.map((x: any, i: number) =>
                      <Card
                        key={i}
                        title={x.title}
                        description={x.description}
                        price={x.price}
                        link={x.link}
                        img={x.image}
                        onLoad={handleImageLoad}
                      />
                    )}

                </div>
            </div>
        </div>
    )
}

export default Taskpage

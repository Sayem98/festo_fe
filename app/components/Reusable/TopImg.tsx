import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import router from 'next/router';
interface topProp{
    img:string,
    amount:string,
    style:string
}
const TopImg:React.FC <topProp> = ({img, amount,style}) => {
    const user = useSelector((x: any) => x.TaskReducer.user);
    const userData = useSelector((x:any) => x.UsersReducer.currentUser);
    // console.log("111---111", userData);
    const [pointLevel, setPointLevel] = useState<number>(0);
    const [energyLevel, setEnergyLevel] = useState<number>(0);
    const [totalReward, setTotalReward] = useState<number>(0);
    const [count, setCount] = useState<number>(0);
    const [balance, setBalance] = useState<number>(userData?.balance);
    // useEffect(() => {
    //     const fetchData = async () => {
    //       if (user) {
    //         // const { data } = await axios.get(
    //         //   "https://tongym-be-ekfd.onrender.com/users"
    //         // );
    //         // const item = data.find((item: any) => item.tgid === user); // Adjust the condition if needed
    //         // setCount(item?.mount??0);
    //         setBalance(userData?.balance);    
    //         // console.log("----------topimg--------------")
    //       }
    //     };
    //     fetchData();
    //   }, [userData]);
    return (
        <div className={`${style} mt-4 select-none`}>
            <div className='flex flex-row items-center gap-1 z-[5000] justify-center '>
                <Image src={img} alt='' width={56} height={58} />
                <p className='font-bold text-[25px] text-[#FFCE00]'>{Intl.NumberFormat('en-US').format(userData.balance)}</p>
            </div>
        </div>
    )
}

export default TopImg

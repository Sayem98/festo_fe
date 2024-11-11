import React, { useEffect } from 'react'
import TopImg from '../Reusable/TopImg'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux';
import { sortBy } from 'lodash';
import router from 'next/router';
import axios from 'axios';
import { setUser } from '@/redux/reducers/TaskReducer';
import { setCurrentUser } from '@/redux/reducers/UsersReducer';

const Ranking = () => {
    const dispatch = useDispatch();
    const isLoadedUser = useSelector((x: any) => x.UsersReducer.isLoadedUser);
  
    
    const userFromQuery = router.query.user?.toString() || "";
    const user = useSelector((x: any) => x.TaskReducer.user);
    const userdata = useSelector((x:any) => x.UsersReducer.currentUser);

    const users = useSelector((x:any) => x.UsersReducer.users);
    // const userrank = sortBy(users, ['name']);
 
    let myindex = 0;
    const temp = users.map((x:any, i:number)=> {
        
        if(x>0){return {tgid:x.tgid, mount:x.mount, balance:x.balance, index: i}}
        if(x.tgid===user){myindex = i;}

    })
    console.log(user);
    // const mydata = users.find((item: any) => item.tgid === user);
    // temp.sort((a: { mount: number; }, b: { mount: number; }) => a.mount > b.mount ? -1 : a.mount < b.mount ? 1 : 0)
    // console.log(mydata);
    useEffect(() => {
        const fetchData = async () => {
          if (userFromQuery) {
            const { data } = await axios.get(
              "https://tongym-be-ekfd.onrender.com/users"
            );
            const item = data.find((item: any) => item.tgid === userFromQuery); // Adjust the condition if needed
            dispatch(setUser(item.tgid));

            dispatch(setCurrentUser(item));
          }
        };
        

        fetchData();
        // fetch();
      }, []);
    
    return (
        <div className='bg-black h-screen  w-full px-[3%]  select-none'>
            <TopImg
                style='bg-[url(/images/rankingbg.svg)] bg-cover h-[125px] w-full rounded-[10px] items-center justify-center bg-no-repeat flex'
                img='/images/bg/coin.png'
                amount='324,293'
            />

            <div className='h-[70vh] overflow-y-scroll'>

                {/* user board */}
                <div className="w-full border-2 mt-5 rounded-[12px] px-[24px] py-[2px] bg-[#0C0C0D] border-[#2C2C2E] flex flex-row justify-between items-center">
                    <div className='flex items-center gap-4'>
                        <Image src={"/images/Frame 43.svg"} alt='' width={40} height={37} />
                        <div className='flex flex-col text-white'>
                            <p className='text-[17px]'>{userdata.tgid}</p>
                            <div className='flex flex-row gap-2 items-center' >
                                <Image src={"/images/bg/coin.png"} width={25} height={20} alt='' />
                                <span className='flex flex-row gap-1 items-center'>
                                    <b className='text-[17px]'>{Intl.NumberFormat('en-US').format(userdata.mount)} <span className='text-gray-500'>OTP</span></b>
                                    {/* <p className='text-[13px]'> {userdata.total_reward} <span className='text-gray-500'>Per Hour</span> </p> */}

                                </span>
                            </div>
                        </div>
                    </div>
                    < div className='text-white'>{myindex+1}</div>
                    {/* <Image src={"/images/medal3.svg"} alt='' width={20} height={20} /> */}
                </div>
                <div className='flex flex-col items-start mt-2'>
                    <p className='text-[20px] text-white font-bold'>Ranking</p>
                </div>
                <div className='flex flex-col gap-2 h-[50vh] overflow-y-scroll'>
                   
                    <div className='flex flex-col gap-2 min-h-[400px]'>
                        {
                            users.map((d:any, i:number) => (
                                <div key={i} className={`w-full border-2 rounded-[12px] px-[24px] py-[2px] bg-[#0C0C0D] border-[#2C2C2E] flex flex-row justify-between items-center ${d.inv==="Hiroshi"? "bg-[#CFFF00]":""}`}>
                                    <div className='flex items-center gap-2'>
                                        {/* <Image src={d.img} alt='' width={40} height={37} /> */}
                                        <div className='flex flex-col text-white'>
                                            <p className='text-[20px]'>{d.tgid}</p>
                                            <div className='flex flex-row gap-2 items-center' >
                                                
                                                <span className='flex flex-row gap-1 items-center'>
                                                    <Image src='/images/bg/coin.png' width={25} height={20} alt='' />

                                                    <b className='text-[17px] text-white'>{Intl.NumberFormat('en-US').format(d.mount)}<span className=' text-gray-500'> OTP</span> </b>
                                                    {/* <p className='text-[13px]'> {d.total_reward} <span className='text-gray-500'>Per Hour</span> </p> */}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <TbChevronRight className='text-white' /> */}
                                    {/* <Image src={"/images/medal3.svg"} alt='' width={20} height={20} /> */}
                                    < div className='text-white'>{i+1}</div>
                                </div>

                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Ranking

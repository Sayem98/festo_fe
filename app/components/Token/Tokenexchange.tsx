import React, { FormEvent, forwardRef, Ref, useEffect, useState } from 'react'
import TopImg from '../Reusable/TopImg'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux';
import { sortBy } from 'lodash';
import router from 'next/router';
import axios from 'axios';
import { setUser } from '@/redux/reducers/TaskReducer';
import { setCurrentUser } from '@/redux/reducers/UsersReducer';
import { setRate } from '@/redux/reducers/TaskReducer';
import { TransitionProps, useSnackbar } from 'notistack';
import { Slide } from '@mui/material';

import { useBalance } from 'wagmi';
import { updateItem, updateODP, updateRate } from '@/app/lib/api';


const Transition = forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: Ref<unknown>
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const Tokenexchange: React.FC = () => {
  
    const dispatch = useDispatch();
    const isLoadedUser = useSelector((x: any) => x.UsersReducer.isLoadedUser);
  
    
    const userFromQuery = router.query.user?.toString() || "";
    const user = useSelector((x: any) => x.TaskReducer.user);
    const userdata = useSelector((x:any) => x.UsersReducer.currentUser);
    const rate = useSelector((x:any) => x.TaskReducer.rate);
   
    const users = useSelector((x:any) => x.UsersReducer.users);
    // const userrank = sortBy(users, ['name']);
    const delta:Date = userdata.ratedate;
    // console.log(!delta);
    const lastTime = (new Date(delta)).getTime();
    const currentTime = (new Date()).getTime();
    const h = Math.floor((lastTime + 86400000 - currentTime)/1000/60/60);
    const m = Math.floor((lastTime + 86400000 - currentTime-h*3600000)/1000/60);
    const s = Math.floor((lastTime + 86400000 - currentTime-h*3600000-m*60000)/1000);

    // const mydata = users.find((item: any) => item.tgid === user);
    // temp.sort((a: { mount: number; }, b: { mount: number; }) => a.mount > b.mount ? -1 : a.mount < b.mount ? 1 : 0)
    // console.log(mydata);
    const [inputPubkey, setinputPubkey] = useState<string>('');
    const [showPubkey, setShowPubkey] = useState<string>(userdata.publickey);
    // const temp = getbalance(userdata.publickey)
    const [inputODP, setInputODP] = useState<number>();
    const [showOTP, setShowOTP] = useState<number>();
    const [inputOTP, setInputOTP] = useState<number>();
    const [showODP, setShowODP] = useState<number>();

    const [otp, setOtp] = useState<number>(userdata.balance);
    const [odp, setOdp] = useState<number>(userdata.odp);

    const [odprate, setOdprate] = useState<number>(rate.odp);
    const [otprate, setOtprate] = useState<number>(rate.otp);

    const data = useBalance({
      // address: '0xcd1591A21864979ed7038B5876dA374f90eBe655',
      address: userdata.publickey as any,

      token: '0x37Fe635D1e25B2F7276C1B9dBBcc7b087f80C050',
      
    })
    const [claimOci, setClaimOci] = useState<number>(Math.round(Number(data.data?.value)/(10**18)?Number(data.data?.value)/(10**18):0));
    const [claimODP, setClaimODP] = useState<number>(Math.floor(claimOci*rate.odp/rate.ocicat));

    const [addODP, setaddODP] = useState<number>(rate.odp);
    // const [addOTP, setaddOTP] = useState<number>(rate.otp);
    const [addOci, setaddOci] = useState<number>(rate.ocicat);
    const [showhour, setShowhour] = useState<number>();
    const [showminute, setShowminute] = useState<number>();
    const [showsecond, setShowsecond] = useState<number>();

    const handleaddOci = (e: React.ChangeEvent<HTMLInputElement>) => {
      setaddOci(Number(e.target.value));
    };
    const handleaddODP = (e: React.ChangeEvent<HTMLInputElement>) => {
      setaddODP(Number(e.target.value));
    };
     useEffect(() => {
      const fetchData = async () => {
        
        setClaimOci(Math.round(Number(data.data?.value)/(10**18)?Number(data.data?.value)/(10**18):0));
        setClaimODP(Math.floor(claimOci*rate.odp/rate.ocicat));
        
      };
      fetchData();
    }, [data]);
    const handleRate = async(e: FormEvent<HTMLFormElement>) => {
      
        e.preventDefault();
        console.log('Form submitted:', inputPubkey);
        const response = await updateRate(rate.title, addOci, rate.otp, addODP);
        console.log(response);
        {
        const { data } = await axios.get(
          "https://tongym-be-ekfd.onrender.com/users"
        );
        const item = data.find((item: any) => item.tgid === userFromQuery); // Adjust the condition if needed
        dispatch(setUser(item.tgid));
        setShowPubkey(inputPubkey);
        dispatch(setCurrentUser(item));
        dispatch(setRate({title:rate.title, ocicat:addOci, otp: rate.otp, odp: addODP }));
        snackbar.enqueueSnackbar(
          `${response.stats}`,
          { autoHideDuration: 2000, variant: 'success' }
        );
        }
      
      
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setinputPubkey(e.target.value);
    };
    const handleInputODP = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputODP(Number(e.target.value));
      setShowOTP(Math.round(Number(e.target.value)*rate.otp/rate.odp));
    };
    const handleInputOTP = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputOTP(Number(e.target.value));
      setShowODP(Math.round(Number(e.target.value)*rate.odp/rate.otp));
    };
    const snackbar = useSnackbar();
    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // Handle form submission
      console.log('Form submitted:', inputPubkey);
      const response = await axios.post(
        `https://tongym-be-ekfd.onrender.com/publickey`,
        {
          user: user,
          address: inputPubkey
        }
      );
      if(response.data.stats =="success"){
        const { data } = await axios.get(
          "https://tongym-be-ekfd.onrender.com/users"
      );
      const item = data.find((item: any) => item.tgid === userFromQuery); // Adjust the condition if needed
      dispatch(setUser(item.tgid));
      setShowPubkey(inputPubkey);
      dispatch(setCurrentUser(item));
      snackbar.enqueueSnackbar(
        `${response.data.content}`,
        { autoHideDuration: 2000, variant: 'success' }
      );
    }
      
      // console.log("sdfsdf------------",userdata);
      
      // You can also send data to an API here
      setinputPubkey(''); // Clear the input after submission
    };
    const handleOdpOtp = async(e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if(inputODP && inputODP>=0 && userdata.odp>inputODP){
        await updateODP(user, -inputODP);
        await updateItem(user,showOTP||0, showOTP||0);


        const response = await axios.post(
          `https://tongym-be-ekfd.onrender.com/tgid`,
          {
            user: user,
            
          }
        ).then()
        // dispatch(useSelector())response.data;
        dispatch(setCurrentUser(response.data));
        setOdp(response.data.odp);
        setOtp(response.data.balance);

        console.log("point-user",response.data )

        snackbar.enqueueSnackbar(
          ` ${inputODP} ODP => ${showOTP} OTP`,
          { autoHideDuration: 1000,  variant: 'success'}
        );
        setInputODP(0);
        setShowOTP(0);
      }
      else{
        snackbar.enqueueSnackbar(
          `Input ODP correct`,
          { autoHideDuration: 2000, variant: 'success' }
        );
      }
    }
    const handleOtpOdp = async(e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if(inputOTP && inputOTP>=0 && userdata.odp>inputOTP){
        await updateODP(user, showODP||0);
        await updateItem(user,-inputOTP, -inputOTP);
        const response = await axios.post(
          `https://tongym-be-ekfd.onrender.com/tgid`,
          {
            user: user,
            
          }
        ).then()
        // dispatch(useSelector())response.data;
        dispatch(setCurrentUser(response.data));
        setOdp(response.data.odp);
        setOtp(response.data.balance);

        console.log("point-user",response.data )

        snackbar.enqueueSnackbar(
          ` ${inputOTP} ODP => ${showODP} OTP`,
          { autoHideDuration: 1000,  variant: 'success'}
        );
        setInputOTP(0);
      }
      else{
        snackbar.enqueueSnackbar(
          `Input ODP correct`,
          { autoHideDuration: 2000, variant: 'warning' }
        );
      }
    }
    const handleOciOdp = async(e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const delta:Date = userdata.ratedate;
      console.log(!delta);
      const lastTime = (new Date(delta)).getTime();
      const currentTime = (new Date()).getTime();
      console.log(new Date());//86400000
      if((currentTime-lastTime)>=86400000 || !delta){
        await updateODP(user, claimODP||0);
        await axios.post(
          `https://tongym-be-ekfd.onrender.com/ratedate`,
          {
            user:user,
            
          }
        );
        const response = await axios.post(
          `https://tongym-be-ekfd.onrender.com/tgid`,
          {
            user: user,
            
          }
        ).then()
        // dispatch(useSelector())response.data;
        dispatch(setCurrentUser(response.data));
        setOdp(response.data.odp);
        setOtp(response.data.balance);
        setShowhour(h);
        setShowminute(m);
        setShowsecond(s);
        snackbar.enqueueSnackbar(
          ` ${claimOci} ODP => ${claimODP} OTP`,
          { autoHideDuration: 1000,  variant: 'success'}
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
    // useEffect(() => {
    //     const fetchData = async () => {
    //       if (userFromQuery) {
    //         const { data } = await axios.get(
    //           "https://tongym-be-ekfd.onrender.com/users"
    //         );
    //         const item = data.find((item: any) => item.tgid === userFromQuery); // Adjust the condition if needed
    //         dispatch(setUser(item.tgid));

    //         dispatch(setCurrentUser(item));
            
    //       }
    //     };
        

    //     fetchData();
    //   }, []);

    useEffect(() => {
        const fetchData = async () => {
          setOtp(userdata.balance);
          setOdp(userdata.odp);
        };
        

        fetchData();
      }, [userdata]);

    console.log(userdata);
    
    console.log((currentTime-lastTime));    
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
        <div className='bg-black h-screen  w-full px-[3%]  select-none'>
            <TopImg
                style='bg-[url(/images/rankingbg.svg)] bg-cover h-[125px] w-full rounded-[10px] items-center justify-center bg-no-repeat flex'
                img='/images/bg/coin.png'
                amount='324,293'
            />

            <div className='w-full overflow-y-scroll h-[500px] pb-[200px]'>
              {showPubkey?(
                <div className='mt-2'>
                  <div className='text-white break-words w-full bg-green-500 bg-opacity-50 px-2 rounded-t-lg'>
                  Wallet  Address:
                  </div>
                  <div className='text-white break-words w-full bg-white bg-opacity-20 px-2'>
                  {showPubkey}
                  </div>
                  <div className='text-white bg-green-500 bg-opacity-50 px-2 flex justify-between'>
                    <div>0x00000000000000000000000000000000000000 Balance :</div> <div>{Number(data.data?.value)/(10**18)}</div>
                  </div>
                  
                </div>
                )
              :<div className='text-white'>You should submit your address</div>}
              <div className='text-white bg-white bg-opacity-20 px-2 flex justify-between'>
                <div>OTP Balance :</div> <div>{otp}</div> 
              </div>
              <div className='text-white bg-green-500 bg-opacity-50 px-2 rounded-b-lg flex justify-between'>
                <div>ODP Balance :</div> <div>{odp}</div> 
              </div>
              
              <form onSubmit={handleSubmit} className='w-full flex mt-2'>
                  <input
                  className='w-full p-2 rounded-l-lg'
                  type="text"
                  value={inputPubkey}
                  onChange={handleChange}
                  placeholder="Enter Your Wallet Address"
                  required
                  
                  />
                  <button className='text-white bg-green-500 px-4 py-2  rounded-r-lg' type="submit">Submit</button>
              </form>
              {/* <div className='text-white'>
                <div className='pt-2'><span className='text-green-400 font-bold'>ODP</span> ={">"} <span className='text-red-400 font-bold'>OTP</span></div>
                <form onSubmit={handleOdpOtp} className='w-full flex mt-2  items-center'>
                  <input
                  className='w-full p-2 rounded-l-lg border-2 border-green-400 text-black'
                  type="number"
                  value={inputODP}
                  onChange={handleInputODP}
                  
                  placeholder="ODP"
                  required
                  
                  />
                  <div>={'>'}</div>
                  <input
                  className='w-full p-2  border-2 border-red-400 bg-gray-500'
                  type="number"
                  value={showOTP}
                  onChange={handleInputODP}
                  placeholder="OTP"
                  required
                  readOnly
                  />
                  <button className='text-white bg-red-500 px-4 py-2 border-2 border-red-400  rounded-r-lg' type="submit">Submit</button>
                </form>
              </div>
              <div className='text-white'>
                <div className='pt-2'><span className='text-red-400 font-bold'>OTP</span> ={">"} <span className='text-green-400 font-bold'>ODP</span></div>
                <form onSubmit={handleOtpOdp} className='w-full flex mt-2  items-center'>
                  <input
                  className='w-full p-2 rounded-l-lg border-2 border-red-400 text-black'
                  type="text"
                  value={inputOTP}
                  onChange={handleInputOTP}
                  placeholder="OTP"
                  required
                  
                  />
                  <div>={'>'}</div>
                  <input
                  className='w-full p-2  border-2 border-green-400 bg-gray-500'
                  type="text"
                  value={showODP}
                  onChange={handleInputOTP}
                  placeholder="ODP"
                  required
                  readOnly
                  />
                  <button className='text-white bg-green-500 px-4 py-2  rounded-r-lg border-2 border-green-400' type="submit">Submit</button>
                </form>
              </div> */}
              <div className='text-white'>
                <div className='pt-2'><span className='text-white font-bold'>0x00000000000000000000000000000000000000</span> ={">"} <span className='text-green-400 font-bold'>ODP</span></div>
                <div className='text-red-500'>{showhour}h:{showminute}m:{showsecond}s</div>
                <form onSubmit={handleOciOdp} className='w-full mt-2  items-center'>
                  <input
                  className='w-full p-2 rounded-lg border-2 border-white-400 bg-gray-500'
                  type="text"
                  value={claimOci}
                  
                  placeholder="0x00000000000000000000000000000000000000"
                  required
                  readOnly
                  />
                  <div>={'>'}</div>
                  <input
                  className='w-full p-2  border-2 border-green-400 bg-gray-500'
                  type="text"
                  value={claimODP}
                  
                  placeholder="ODP"
                  required
                  readOnly
                  />
                  <button className='w-full text-white bg-green-500 px-4 py-2  rounded-b-lg border-2 border-green-400' type="submit">Claim</button>
                </form>
              </div>
              {
              userdata.tgid == "eprincy" &&
                <div className='text-white'>
                  <div className='pt-2 text-red-500'>Admin Page for Rate <span> {"("} {rate.ocicat} : {rate.odp} {")"} </span></div>
                  <form onSubmit={handleRate} className='w-full flex mt-2  items-end'>
                    <div className='w-full'>
                      <div>0x00000000000000000000000000000000000000</div>
                      <input
                      className='w-full p-2 rounded-l-lg border-2 border-green-400 bg-white text-black'
                      type="text"
                      value={addOci}
                      onChange={handleaddOci}
                      placeholder="0x00000000000000000000000000000000000000"
                      required
                      
                      />
                    </div>
                    <div className='w-full'>
                      <div>ODP</div>
                      <input
                      className='w-full p-2 border-2 border-green-400 bg-white text-black'
                      type="text"
                      value={addODP}
                      onChange={handleaddODP}
                      placeholder="ODP"
                      required
                      
                      />
                    </div>
                    {/* <div className='w-full'>
                      <div>OTP</div>
                      <input
                      className='w-full p-2  border-2 border-green-400 bg-white text-black'
                      type="text"
                      value={addOTP}
                      onChange={handleaddOTP}
                      placeholder="OTP"
                      required
                      
                      />
                    </div> */}
                    <div>
                    <button className='text-white bg-green-500 px-4 py-2  rounded-r-lg border-2 border-green-400' type="submit">Confirm</button>
                    </div>
                  </form>
                </div>
              }
            </div>
        </div>
    )
}

export default Tokenexchange

"use Client";

import React, { Ref, forwardRef, useEffect, useRef, useState } from "react";
import { getUserDataByTgid, updateItem, updateReward } from "@/app/lib/api";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import axios from "@/app/axios";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import "../../globals.css";
import Image from "next/image";
import { IoMdCheckmark } from "react-icons/io";
import { TbChevronRight } from "react-icons/tb";
import { setBuilds } from "@/redux/reducers/BuildReducer";
import { setCurrentUser } from "@/redux/reducers/UsersReducer";
interface CardProps {
  title: string;
  img: string;
  level: number;
  reward: number;
  stepReward:number;
  payment: number;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Cardbuild({ title,img, level, reward,stepReward, payment }: CardProps) {
  const user = useSelector((x: any) => x.TaskReducer.user);
  const userdata = useSelector((x:any) => x.UsersReducer.currentUser);
  const snackbar = useSnackbar();
  const [open, setOpen] = useState(false);
  const [doing, setDoing] = useState(false);
  const forceRef = useRef(null);
  // const user = useSelector((x: any) => x.TaskReducer.user);
  const [count, setCount] = useState<number>(0);
  const [balance, setBalance] = useState<number>(userdata.balance);
  const [totalReward, setTotalReward] = useState<number>(userdata.total_reward);

  const [pointLevel, setPointLevel] = useState<number>(0);
  const [energyLevel, setEnergyLevel] = useState<number>(0);
  const dispatch = useDispatch();
  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (user) {
  //       const { data } = await axios.get(
  //         "https://tongym-be-ekfd.onrender.com/builds"
  //       );
  //       dispatch(setBuilds(data));
  //       // setCount(userinfo?.mount??0);
  //       // setBalance(userinfo?.balance??0);    
  //       // setPointLevel(userinfo?.point_level??0);
  //       // setEnergyLevel(userinfo?.energy_level??0);
  //     }
  //   };
  //   fetchData();
  // }, [balance]);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBoost = () => {
    setBalance(userdata.balance);
    console.log(userdata.balance);
    setDoing(true);
    if(userdata.balance<payment) {snackbar.enqueueSnackbar("Your balance isn't enough", {
      autoHideDuration: 1000,
    }); return;}
    if(userdata.balance>=payment){
      updateItem(user, 0, -payment);
      if(level>0){
        updateReward(user, stepReward);
        // setTotalReward(totalReward+stepReward)
      }
      else {
        updateReward(user, reward);
        // setTotalReward(totalReward+reward)
      }
      // console.log("/////11111", totalReward);
      setBalance(balance-payment);
      axios
        .post("https://tongym-be-ekfd.onrender.com/builds", {
          user, title
        })
        .then(async (response: any) => {
          console.log(response.data);
          if (response.data.stats == "success"){
            
            const { data } = await axios.get(
              "https://tongym-be-ekfd.onrender.com/builds"
            );
            dispatch(setBuilds(data));
            const response = await axios.post(
              `https://tongym-be-ekfd.onrender.com/tgid`,
              {
                user: user,
              }
            );
            dispatch(setCurrentUser(response.data));
            console.log("boost user",response.data )
            // console.log("/////22222", response.data.total_reward)
            // setBalance(response.data.balance);
            // setTotalReward(response.data.total_reward);
            snackbar.enqueueSnackbar(
              `You upgraded level to ${level+1}`,
              { autoHideDuration: 1000, variant : "success" }
            );}
          else
            snackbar.enqueueSnackbar("You need to wait 24 hours for next time", {
              autoHideDuration: 1000,
            });
          // setTimeout(() => (forceRef?.current as any).click(), 1000);
          setOpen(false);
          setDoing(false);
        });
      }
    
  };
  return (
    <>
      <div className='border-[1px] border-white border-opacity-20 rounded-[10px] px-3 bg-[#202020] bg-opacity-80' onClick={handleClickOpen}>
          <div className='flex flex-row items-center gap-1 min-h-[80px] justify-between'>
              <Image src={img} width={70} height={70} alt='' />
              <div className="w-full text-right">
                  <p className='font-bold text-[14px] text-white'>{title}</p>
                  <p className='text-[9px]'>Profit per hour</p>
                  <span className='flex flex-row justify-end'>
                      <Image src="/images/bg/coin.png" width={20} height={20} alt='' />
                      <p className='text-[14px]'>{Intl.NumberFormat('en-US').format(reward)}</p>
                  </span>
              </div>
          </div>
          <hr className='w-full h-[1px] opacity-40' />
          <div className='font-bold flex flex-row items-center justify-between'>
              <span>lvl {level}</span>
              <div className='h-[14px] w-[1px] bg-gray-400 ml-2'></div>
              <span className='flex items-center'>
                  <Image src="/images/bg/coin.png" width={20} height={20} alt='' />
                  {Intl.NumberFormat('en-US').format(payment)}
              </span>
          </div>

      </div>      
      
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{ backdropFilter: "blur(19px)" }}
      >
        <DialogContent>
          <DialogContentText
            id="alert-dialog-slide-description"
            
          >
            <img
              className="absolute top-[21px] right-[27px] cursor-pointer"
              onClick={handleClose}
              src="/images/close.svg"
            />
            <span className="flex flex-col text-center">
              <img
                src={img}
                alt="mexc"
                className="w-[200px] h-[200px] self-center"
              />
              <span className="mt-[20px] font-semibold text-[32px] leading-[32px] text-[#CFFF00]">
                {title}
              </span>
              <span className="mt-[10px] text-[14px] leading-[14px] text-[#6E6E6E]">
                For Level {level+1}, you should pay
              </span>

              <span className="mt-[30px] font-semibold text-[16px] leading-[16px] text-[#6E6E6E]">
                
              </span>
              <span className="flex justify-center space-x-[10.61px] items-center mt-[18.5px] font-bold text-[29px] leading-[29px] text-[#CFFF00]">
                <img
                  src="/images/bg/coin.png"
                  alt="dollar"
                  className="w-[31.84px] h-[31.84px]"
                />
                <div>{Intl.NumberFormat('en-US').format(payment)}</div>
              </span>
              <span className="flex justify-center mt-[29.08px]">
                <button
                  className="px-4 h-[82px] font-semibold text-[24px] bg-[#CFFF00] text-black rounded-[16px] transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed w-full"
                  onClick={handleBoost}
                  disabled={doing}
                >
                  Go ahead
                </button>
              </span>
            </span>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Cardbuild;


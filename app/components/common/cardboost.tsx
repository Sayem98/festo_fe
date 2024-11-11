"use Client";

import React, { Ref, forwardRef, useEffect, useRef, useState } from "react";
import { getUserDataByTgid, updateItem } from "@/app/lib/api";
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
import { setCurrentUser } from "@/redux/reducers/UsersReducer";
interface CardProps {
  title: string;
  name: string;
  level: number;
  price: number;
  img: string;
  
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Card({ title,name, level, price, img }: CardProps) {
  const user = useSelector((x: any) => x.TaskReducer.user);
  const userdata = useSelector((x:any) => x.UsersReducer.currentUser);
  const snackbar = useSnackbar();
  const [open, setOpen] = useState(false);
  const [doing, setDoing] = useState(false);
  const forceRef = useRef(null);
  // const user = useSelector((x: any) => x.TaskReducer.user);
  const [count, setCount] = useState<number>(0);
  const [balance, setBalance] = useState<number>(userdata.balance);
  const [pointLevel, setPointLevel] = useState<number>(userdata.point_level);
  const [energyLevel, setEnergyLevel] = useState<number>(userdata.energy_level);
  const [blevel, setBlevel] = useState<number>(level);
  const [bprice, setBprice] = useState<number>(price);

  const dispatch = useDispatch();
  // useEffect(() => {
    // const fetchData = async () => {
    //   if (user) {
        
    //     const userinfo = await getUserDataByTgid(user)
    //     dispatch(setCurrentUser(userinfo));
        // setCount(userinfo?.mount??0);
        // setBalance(userinfo?.balance??0);    
        // setPointLevel(userinfo?.point_level??0);
        // setEnergyLevel(userinfo?.energy_level??0);
        // setTotalReward(userinfo?.total_reward??0);
        // setLevel(getLevelInfo(userinfo.count)?.number||1);
        // setStepAmount(getLevelInfo(userinfo.count)?.number||1+userinfo.setPointLevel);
        // console.log(item);
  //     }
  //   };
  //   fetchData();
  // }, [pointLevel,energyLevel]);
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
    if(userdata.balance<bprice) {snackbar.enqueueSnackbar("Your balance isn't enough", {
      autoHideDuration: 1000, variant: 'error'
    }); return;}
    if(userdata.balance>=bprice){
      if(name==="point_level"){
        updateItem(user, 0, -bprice);
        setBalance(balance-bprice);
        axios
          .post("https://tongym-be-ekfd.onrender.com/point", {
            user,
          })
          .then(async (response: any) => {
            console.log(response.data);
            if (response.data.stats == "success"){
              setBlevel(blevel+1);
              setBprice(bprice*2);
              

            const response = await axios.post(
              `https://tongym-be-ekfd.onrender.com/tgid`,
              {
                user: user,
                
              }
            );
            // dispatch(useSelector())response.data;
            dispatch(setCurrentUser(response.data));
            console.log("point-user",response.data )

              snackbar.enqueueSnackbar(
                `You upgraded level to ${blevel+1}`,
                { autoHideDuration: 1000,  variant: 'success'}
              );}
            else
              snackbar.enqueueSnackbar("You need to wait 24 hours for next time", {
                autoHideDuration: 1000, variant: 'warning'
              });
            // setTimeout(() => (forceRef?.current as any).click(), 1000);
            setOpen(false);
            setDoing(false);
        });
      }
    if(name==="energy_level"){
      updateItem(user, 0, -bprice);
      setBalance(balance-bprice);
      axios
        .post("https://tongym-be-ekfd.onrender.com/energy", {
          user,
        })
        .then(async (response: any) => {
          console.log(response.data);
          if (response.data.stats == "success"){
            setBlevel(blevel+1);
            

            setBprice(bprice*2);

            const response = await axios.post(
              `https://tongym-be-ekfd.onrender.com/tgid`,
              {
                user: user,
                
              }
            );
            // dispatch(useSelector())response.data;
            dispatch(setCurrentUser(response.data));
            console.log("energy-user",response.data )
            snackbar.enqueueSnackbar(
              `You upgraded level to ${blevel+1}`,
              { autoHideDuration: 1000, variant: 'success' }
            );
          }
          else
            snackbar.enqueueSnackbar("Boost is failed", {
              autoHideDuration: 1000, variant: 'error'
            });
          // setTimeout(() => (forceRef?.current as any).click(), 1000);
          setOpen(false);
          setDoing(false);
        });
      }
    }
  };
  return (
    <>
    <div  className="select-none w-full border-[1px] border-white border-opacity-20 rounded-[12px] px-4 py-[2px] bg-[#0C0C0D] flex flex-row justify-between gap-x-2 items-center " onClick={handleClickOpen}>
      <div className='py-2 gap-4 flex items-center'>

          <Image src={img} alt='' width={40} height={40} />
          <div className='flex flex-col text-white'>
              <p className='text-[14px]'>{title}</p>
              <div className='flex flex-row gap-2 items-center' >
                  <span className='flex flex-row items-center'>
                      <Image src='/images/bg/coin.png' width={20} height={20} alt='' />
                      <b className='text-[17px]'>{bprice}&nbsp;&#8226; </b>
                      <b className='text-[17px]'> &nbsp;{blevel} Level</b>

                  </span>
              </div>
          </div>
      </div>
      {/* <TbChevronRight className='text-white' /> */}
      <TbChevronRight className='text-white' />

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
                className="w-[114px] h-[114px] self-center"
              />
              <span className="mt-[35px] font-semibold text-[32px] leading-[32px] text-[#CFFF00]">
                {title}
              </span>
              <span className="mt-[17px] font-medium text-[14px] leading-[14px] text-[#6E6E6E]">
                {blevel}
              </span>

              <span className="mt-[61px] font-semibold text-[16px] leading-[16px] text-[#6E6E6E]">
                
              </span>
              <span className="flex justify-center space-x-[10.61px] items-center mt-[18.5px] font-bold text-[29px] leading-[29px] text-[#CFFF00]">
                <img
                  src="/images/bg/coin.png"
                  alt="dollar"
                  className="w-[31.84px] h-[31.84px]"
                />
                <div>-{bprice}</div>
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

export default Card;

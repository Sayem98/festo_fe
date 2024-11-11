"use client";
import React, { useState, useEffect, useRef, forwardRef, Ref } from "react";
import Image from "next/image";
import Summary from "@/app/components/Reusable/Summary";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import axios from "@/app/axios";
// import * as idleAnim from "../app/animations/Ghost_Idle.json";
// import * as eatAnim from "../app/animations/Ghost_Eat.json";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setTasks } from "@/redux/reducers/TaskReducer";
// import { updateItem } from "../app/lib/api";
import { getUserDataByTgid, updateItem } from "@/app/lib/api";
import { setCurrentUser, setTempMount } from "@/redux/reducers/UsersReducer";
import { Dialog, DialogContent, DialogContentText, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
// const LEVEL_STEP = 5000;
const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const Growpage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const levelinfo = [
    {
      level: 1,
      lable: "Starter",
      amount: "100,000",
    },
    {
      level: 2,
      lable: "Bronze",
      amount: "500,000",
    },
    {
      level: 3,
      lable: "Silver",
      amount: "5,000,000",
    },
    {
      level: 4,
      lable: "Gold",
      amount: "50,000,000",
    },
    {
      level: 5,
      lable: "Sapphire",
      amount: "500,000,000",
    },
    {
      level: 6,
      lable: "Emerald",
      amount: "5,000,000,000",
    },
    {
      level: 7,
      lable: "Ruby",
      amount: "50,000,000,000",
    },
    {
      level: 8,
      lable: "Diamond",
      amount: "500,000,000,000",
    },
    {
      level: 9,
      lable: "Master",
      amount: "1,000,000,000,000",
    },
    {
      level: 10,
      lable: "Legend",
      amount: "10,000,000,000,000",
    },
  ];
  const getLevelInfo = (amount: number) => {
    if (amount >= 0 && amount < 100000) return { text: "Starter", number: 1 };
    if (amount >= 100000 && amount < 500000)
      return { text: "Bronze", number: 2 };
    if (amount >= 500000 && amount < 5000000)
      return { text: "Silver", number: 3 };
    if (amount >= 5000000 && amount < 50000000)
      return { text: "Gold", number: 4 };
    if (amount >= 50000000 && amount < 500000000)
      return { text: "Sapphire", number: 5 };
    if (amount >= 500000000 && amount < 5000000000)
      return { text: "Emerald", number: 6 };
    if (amount >= 5000000000 && amount < 50000000000)
      return { text: "Ruby", number: 7 };
    if (amount >= 50000000000 && amount < 500000000000)
      return { text: "Diamond", number: 8 };
    if (amount >= 500000000000 && amount < 1000000000000)
      return { text: "Master", number: 9 };
    if (amount >= 1000000000000 && amount < 10000000000000)
      return { text: "Legend", number: 10 };

    if (amount >= 10000000000000) return { text: "God", number: 11 };
  };
  const LevelCountArr = [
    0, 100000, 500000, 5000000, 50000000, 500000000, 5000000000, 50000000000,
    500000000000, 1000000000000, 1000000000000, 10000000000000,
  ];
  const user = useSelector((x: any) => x.TaskReducer.user);
  const userdata = useSelector((x: any) => x.UsersReducer.currentUser);
  const users = useSelector((x: any) => x.UsersReducer.users);
  console.log(userdata);
  const tempMount = useSelector((x: any) => x.UsersReducer.tempMount);

  const [pointLevel, setPointLevel] = useState<number>(userdata.point_level);
  const [energyLevel, setEnergyLevel] = useState<number>(userdata.energy_level);
  const [totalReward, setTotalReward] = useState<number>(userdata.total_reward);
  const [count, setCount] = useState<number>(userdata.mount);
  const [balance, setBalance] = useState<number>(userdata.balance);
  // const [level, setLevel] = useState<number>(getLevelInfo(userdata.mount)?.number||1)
  const [stepAmount, setStepAmount] = useState<number>(
    getLevelInfo(userdata.mount)?.number + userdata.point_level
  );
  const [tempcount, setTempcount] = useState<number>(stepAmount);

  const maxEnergy = 1000 + 500 * energyLevel;
  const dispatch = useDispatch();
  // dispatch(setMountTemp(maxEnergy));
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (user) {

  //       const response = await axios.post(
  //         `https://tongym-be-ekfd.onrender.com/tgid`,
  //         {
  //           user: user,

  //         }
  //       );
  //       dispatch(setCurrentUser(response.data));

  //     }
  //   };
  //   fetchData();
  // }, [user]);

  // const [energy, setEnergy] = useState<number>(3000);
  // const [maxEnergy, setMaxEnergy] = useState<number>(1000 + 100*energyLevel);
  // const maxEnergy: number = 1000;
  const [mount, setMount] = useState<number>(tempMount);

  const [animations, setAnimations] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  let animationId = 0;
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // console.log("-----user redux--", user)
  const [pulses, setPulses] = useState([]);
  const router = useRouter();
  const userFromQuery = router.query.user?.toString() || "";

  let level = getLevelInfo(userdata.mount)?.number || 1;
  let current_levelcount = LevelCountArr[level - 1];
  let next_levelcount = LevelCountArr[level];
  let current_pecent =
    ((count - current_levelcount) * 100) /
    (next_levelcount - current_levelcount);

  const handleIncrement = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    let payload: any = [...pulses];
    payload.push(0);
    setPulses(payload);
    // const { clientX, clientY } = event
    if (mount <= stepAmount) return;

    // Move the ball up

    if ("touches" in event) {
      const touches = Array.from(event.touches);
      touches.forEach((touch) => {
        setAnimations((prev) => [
          ...prev,
          { id: animationId++, x: touch.clientX, y: touch.clientY },
        ]);
        const newCount = count + stepAmount;
        const newBalace = balance + stepAmount;
        setCount(newCount);
        setBalance(newBalace);
        setMount(mount - stepAmount);
        setTempcount(tempcount + stepAmount);
        dispatch(setTempMount(mount));
        const temp = {
          id: userdata.id,
          tgid: userdata.tgid,
          mount: newCount,
          balance: newBalace,
          point_level: userdata.point_level,
          energy_level: userdata.energy_level,
          total_reward: userdata.total_reward,
          friendid: userdata.friendid,
          publickey: userdata.publickey,
          privatekey: userdata.privatekey,
          date: userdata.date,
          enery: userdata.enery,
          full_energy: userdata.full_energy,
          odp: userdata.odp,
          ratedate: userdata.ratedate,
          // friendid:userdata.friendid,
          // mount:newCount,
          // point_level:userdata.point_level,

          // tgid:userdata.tgid,
        };
        dispatch(setCurrentUser(temp));
        // try {
        //   updateItem(user, stepAmount, stepAmount); // Use the correct item ID here
        // } catch (error) {
        //   console.error("Failed to update item", error);
        // }
      });
    } else {
      setAnimations((prev) => [
        ...prev,
        { id: animationId++, x: event.clientX, y: event.clientY },
      ]);
      const newCount = count + stepAmount;
      const newBalace = balance + stepAmount;
      setCount(newCount);
      setBalance(newBalace);
      setMount(mount - stepAmount);
      setTempcount(tempcount + stepAmount);
      dispatch(setTempMount(mount));
      // try {
      //   updateItem(user, stepAmount, stepAmount); // Use the correct item ID here
      // } catch (error) {
      //   console.error("Failed to update item", error);
      // }
    }

    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = setTimeout(async () => {
      try {
        if (user) {
          updateItem(user, tempcount, tempcount);
          console.log("--------------------", tempcount);
          setTempcount(0);
          // dispatch(setTempMount(mount));
          console.log("--------------------", mount);
        }
      } catch (error) {
        console.error("Failed to update item", error);
      }

      setAnimations([]);
    }, 2000);
  };

  useEffect(() => {
    if (mount < maxEnergy) {
      const intervalId = setInterval(() => {
        setMount((prevMount) => Math.min(prevMount + 1, maxEnergy)); // Ensure mount doesn't exceed 1000
      }, 1500); // Adjust the interval as needed

      return () => clearInterval(intervalId); // Clean up the interval on unmount
    }
  }, [mount]);
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        // const { data } = await axios.get(
        //   "https://tongym-be-ekfd.onrender.com/users"
        // );
        // const item = data.find((item: any) => item.tgid === user); // Adjust the condition if needed
        // setCount(item?.mount??0);
        setBalance(userdata?.balance);
        // console.log("----------topimg--------------")
      }
    };
    fetchData();
  }, [userdata]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (user) {
  //       const { data } = await axios.get(
  //         "https://tongym-be-ekfd.onrender.com/users"
  //       );
  //       const item = data.find((item: any) => item.tgid === user); // Adjust the condition if needed
  //       setCount(item?.mount ?? 0);
  //     }
  //   };
  //   fetchData();
  // }, [user]);
  // useEffect(() => {
  //   if (userFromQuery) {
  //     const func = async () => {
  //       const { data } = await axios.post(
  //         "https://tongym-be-ekfd.onrender.com/users",
  //         {
  //           user: userFromQuery,
  //         }
  //       );
  //       dispatch(setUser(data.user));
  //     };
  //     func();
  //   }
  // }, [userFromQuery]);

  return (
    <div className="bg-[url(/images/bg/bg2.png)] bg-no-repeat h-screen bg-cover bg-center px-2 relative h-1200px select-none">
      <div className="h-[20vh] flex flex-col justify-between">
        <div className="pt-3 flex flex-row items-center gap-[5%]">
          <Link href={"/rank"}>
            <Image src={"/images/friends.png"} height={60} width={60} alt="" />
          </Link>
          <div className="w-full flex flex-col gap-2 ">
            <div className="flex flex-row w-full justify-between items-center">
              <span className="flex flex-row items-center gap-2">
                <Image src={"/images/cup.svg"} height={20} width={20} alt="" />
                <div
                  className="flex flex-row items-center"
                  onClick={handleClickOpen}
                >
                  <p className="text-[14px] text-white select">
                    {getLevelInfo(count)?.text} {">"}
                  </p>
                </div>
              </span>
              <span className="flex flex-row items-center gap-2">
                <Image
                  src={"/images/network.svg"}
                  height={20}
                  width={20}
                  alt=""
                />
                <p className="text-[14px] text-white">
                  Level {getLevelInfo(count)?.number}/10{" "}
                </p>
              </span>
            </div>
            <div className="relative h-[12px] bg-[#202020] rounded-[30px] w-full p-[1px] border-[#CFFF00] border-[1px] border-opacity-60">
              <div
                className={` h-full rounded-[30px] z-50 bg-gradient-to-tr from-[#CFFF00] via-[#91D097] to-[#2441A8]`}
                style={{ width: `${current_pecent}%` }}
              ></div>
            </div>
            {/* <div className='w-full text-center text-white'>All Members: {Intl.NumberFormat('en-US').format(users.length)} </div> */}
          </div>
        </div>
        <Summary />
      </div>
      <div className="flex py-4 w-full h-[70vh]  pb-90 mb-10  absolute bottom-0 bg-gradient-to-b from-[#1a1c22a4] to-[#000000a4] backdrop-blur-sm rounded-t-[32px] left-0 border-t-2 border-[#5A74FF] backbl overflow-y-scroll">
        <div className="min-h-[450px] w-full flex flex-col justify-between">
          {/* <div className='flex bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#5a73ff69] via-[#5a73ff00] to-[#5a73ff00] inset-0 top-0 absolute rounded-t-[32px] '></div> */}
          <div className="flex flex-row items-center gap-1 z-[5000] justify-center relative">
            <Image
              className="rorating-circle"
              src="/images/bg/coin.png"
              alt=""
              width={40}
              height={58}
            />
            <div className="">
              <span className="opacity-50 text-[20px] text-white font-bold text-center ">
                OTP
              </span>
              <p className="font-bold text-[25px] text-white text-center">
                {Intl.NumberFormat("en-US").format(balance)}{" "}
              </p>
            </div>
          </div>
          <div
            className="w-full flex items-center justify-center z-[5000] relative button"
            onTouchStart={handleIncrement}
          >
            {/* onClick={handleIncrement} */}
            <div className="rotating-circle " />

            {/* <Image src="/images/globe2.png" alt='' className='rotating-circle' width={300} height={306} /> */}
            <AnimatePresence>
              {animations.map((animation, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, y: -100, x: -50, scale: 0.5 }}
                  animate={{ opacity: 0, y: -400, x: -50, scale: 0.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="select-none font-medium text-[20px] text-white touch-none flex items-center"
                  style={{
                    position: "fixed",
                    left: `${animation.x}px`,
                    top: `${animation.y}px`,
                  }}
                >
                  <Image
                    src="/images/bg/coin.png"
                    alt=""
                    width={80}
                    height={80}
                  />
                  +{stepAmount}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="px-5 flex w-full flex-row justify-between z-[5000]">
            <div className="flex flex-row items-center gap-2">
              <Image src="/images/battery.svg" alt="" width={40} height={40} />
              <p className="text-[14px] text-white">
                {mount}/{maxEnergy}
              </p>
            </div>
            <Link
              href={`/build?user=${userFromQuery}`}
              className="flex flex-row items-center gap-2"
            >
              <Image src="/images/store.png" alt="" width={40} height={40} />
              <p className="text-[14px] text-white">Store</p>
            </Link>
            <Link
              href={`/boosts?user=${userFromQuery}`}
              className="flex flex-row items-center gap-2"
            >
              <Image src="/images/boost.png" alt="" width={40} height={40} />
              <p className="text-[14px] text-white">Boost</p>
            </Link>
          </div>
          <div className="w-full flex items-center justify-center h-6"></div>
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
          <DialogContentText id="alert-dialog-slide-description">
            <img
              className="absolute top-[21px] right-[27px] cursor-pointer"
              onClick={handleClose}
              src="/images/close.svg"
            />
            <span className="flex flex-col text-center gap-3">
              {levelinfo.map((item, i) => (
                <div
                  key={i}
                  className={`mt-[10px] text-[20px] leading-[14px]  flex justify-between ${
                    item.level == level ? "text-cyan-400" : "text-[white]"
                  }`}
                >
                  <div>
                    Level {item.level} {"("}
                    {item.lable}
                    {")"} :
                  </div>
                  <div>{item.amount}</div>
                </div>
              ))}

              <span className="flex justify-center mt-[29.08px]">
                <button
                  className="px-4 h-[82px] font-semibold text-[24px] bg-[#CFFF00] text-black rounded-[16px] transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed w-full"
                  onClick={handleClose}
                >
                  OK
                </button>
              </span>
            </span>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Growpage;

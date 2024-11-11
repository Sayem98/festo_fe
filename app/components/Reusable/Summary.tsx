import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import router from "next/router";
import { getUserDataByTgid } from "@/app/lib/api";
import { setCurrentUser } from "@/redux/reducers/UsersReducer";

const Summary = () => {
  const user = useSelector((x: any) => x.TaskReducer.user);
  const userdata = useSelector((x: any) => x.UsersReducer.currentUser);
  const [pointLevel, setPointLevel] = useState<number>(userdata.point_level);
  const [energyLevel, setEnergyLevel] = useState<number>(userdata.energy_level);
  // const [totalReward, setTotalReward] = useState<number>(userdata.total_reward);
  const [count, setCount] = useState<number>(userdata.mount);
  const [balance, setBalance] = useState<number>(userdata.balance);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (user) {
  //       const userinfo = await getUserDataByTgid(user)
  //       // console.log("summary------------",userinfo);
  //       dispatch(setCurrentUser(userinfo));

  //     }
  //   };
  //   fetchData();
  // }, [user]);
  const getLevelInfo = (amount: number) => {
    if (amount >= 0 && amount < 100000) return { text: "Starter", number: 1 };
    if (amount >= 100000 && amount < 500000)
      return { text: "Bronze", number: 2 };
    if (amount >= 500000 && amount < 1000000)
      return { text: "Silver", number: 3 };
    if (amount >= 1000000 && amount < 3000000)
      return { text: "Gold", number: 4 };
    if (amount >= 3000000 && amount < 15000000)
      return { text: "Sapphire", number: 5 };
    if (amount >= 15000000 && amount < 40000000)
      return { text: "Emerald", number: 6 };
    if (amount >= 40000000 && amount < 100000000)
      return { text: "Ruby", number: 7 };
    if (amount >= 100000000 && amount < 500000000)
      return { text: "Diamond", number: 8 };
    if (amount >= 500000000 && amount < 1000000000)
      return { text: "Master", number: 9 };
    if (amount >= 1000000000 && amount < 10000000000)
      return { text: "Legend", number: 10 };

    if (amount >= 10000000000) return { text: "God", number: 11 };
  };
  const LevelCountArr = [
    0, 100000, 500000, 1000000, 3000000, 15000000, 40000000, 100000000,
    500000000, 1000000000, 10000000000, 100000000000,
  ];
  const level = getLevelInfo(count)?.number || 1;
  const stepAmount = level + pointLevel;
  const maxEnergy = 1000 + 500 * energyLevel;
  const userFromQuery = router.query.user?.toString() || "";

  // const user = useSelector((x: any) => x.TaskReducer.user);
  const userData = useSelector((x: any) => x.UsersReducer.currentUser);
  const users = useSelector((x: any) => x.UsersReducer.users);

  const [totalReward, setTotalReward] = useState<number>(0);
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setTotalReward(userData.total_reward);
        // console.log("----------topimg--------------")
      }
    };
    fetchData();
  }, [userData]);
  return (
    <div className="flex flex-row gap-x-1 mt-3 select-none ">
      <div className="w-full roundedl-[20px] py-1 px-2 rounded-tl-[20px] bg-[#202020] bg-opacity-60 backdrop-blur-sm flex flex-row justify-between rounded-bl-[20px] border-[1px] border-[#5A74FF] border-opacity-80">
        <Image src="/images/aura.png" width={30} height={5} alt="" />
        <div className="items-center">
          <p className="text-[11px] text-[gray]">OTP Per Click </p>
          <div className="flex items-center justify-end">
            <p className="text-white font-bold text-[14px]">
              + {Intl.NumberFormat("en-US").format(stepAmount)}
            </p>
            <Image src="/images/bg/coin.png" width={20} height={15} alt="" />
          </div>
        </div>
      </div>
      <div className="w-[250px] roundedl-[20px] py-1 px-2 items-center bg-[#202020] bg-opacity-60 backdrop-blur-sm flex flex-row justify-between border-[1px] border-[#5A74FF] border-opacity-80">
        <div className="w-full items-center">
          <p className="text-[12px] text-center text-[gray]">All Members</p>
          <p className="text-[14px] text-center text-white">
            {Intl.NumberFormat("en-US").format(users.length)}
          </p>
        </div>
      </div>
      <div className="w-full roundedl-[20px] py-1 px-2 rounded-tr-[20px] bg-[#202020] bg-opacity-60 backdrop-blur-sm flex flex-row justify-between rounded-br-[20px] border-[1px] border-[#5A74FF] border-opacity-80">
        <Image src="/images/aura2.png" width={30} height={20} alt="" />
        <div>
          <p className="text-[11px] text-[gray]">OTP Per Hour </p>
          <div className="flex items-center justify-end">
            <p className="text-white font-bold text-[14px]">
              +{Intl.NumberFormat("en-US").format(totalReward + 20 * level)}
            </p>
            <Image src="/images/bg/coin.png" width={20} height={15} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;

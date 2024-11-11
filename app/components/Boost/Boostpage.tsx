import React, { useEffect, useState } from "react";
import TopImg from "../Reusable/TopImg";
import Summary from "../Reusable/Summary";
import Image from "next/image";
import { TbChevronRight } from "react-icons/tb";
import Card from "../common/cardboost";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getUserDataByTgid } from "@/app/lib/api";
import { setCurrentUser, setTempMount } from "@/redux/reducers/UsersReducer";
import SolanaConnectModal from "../connectors/SolanaConnectModal";
import { ConnectWallets } from "../connectors/ConnectWallet";
import { useSnackbar } from "notistack";
const Boostpage = () => {
  const user = useSelector((x: any) => x.TaskReducer.user);
  const users = useSelector((x: any) => x.UsersReducer.users);
  // const currentUser =  useSelector((x:any) => x.UsersReducer.users);
  const userdata = useSelector((x: any) => x.UsersReducer.currentUser);
  const [pointLevel, setPointLevel] = useState<number>(userdata.point_level);
  const [energyLevel, setEnergyLevel] = useState<number>(userdata.energy_level);
  const dispatch = useDispatch();
  const snackbar = useSnackbar();
  // const [energyLevel, setEnergyLevel] = useState<number>(userdata.energy_level);
  const maxEnergy = 1000 + 500 * energyLevel;
  const tempMount = useSelector((x: any) => x.UsersReducer.tempMount);
  const [mount, setMount] = useState<number>(tempMount);
  const [fullenergy, setFullenergy] = useState<number>(userdata.full_energy);
  useEffect(() => {
    if (mount < maxEnergy) {
      const intervalId = setInterval(() => {
        setMount((prevMount) => Math.min(prevMount + 1, maxEnergy)); // Ensure mount doesn't exceed 1000
        dispatch(setTempMount(mount));
        console.log("--------mount--------", mount);
      }, 1500); // Adjust the interval as needed

      return () => clearInterval(intervalId); // Clean up the interval on unmount
    }
  }, [mount]);
  const handlefullenergy = () => {
    if (fullenergy > 0) {
      axios
        .post("https://tongym-be-ekfd.onrender.com/fullenergy", {
          user,
        })
        .then(async (response: any) => {
          if (response.data.stats == "success") {
            const response = await axios.post(
              `https://tongym-be-ekfd.onrender.com/tgid`,
              {
                user: user,
              }
            );
            // dispatch(useSelector())response.data;
            dispatch(setCurrentUser(response.data));
            // console.log("point-user",response.data )
            dispatch(setTempMount(maxEnergy));
            setMount(maxEnergy);
            setFullenergy(fullenergy - 1);
            snackbar.enqueueSnackbar(`You charge full energy ${mount}`, {
              autoHideDuration: 1000,
              variant: "success",
            });
          } else
            snackbar.enqueueSnackbar("failed", {
              autoHideDuration: 1000,
              variant: "warning",
            });
          // setTimeout(() => (forceRef?.current as any).click(), 1000);
        });
    } else {
      snackbar.enqueueSnackbar("You need to wait 24 hours for next time", {
        autoHideDuration: 1000,
        variant: "warning",
      });
    }
  };

  return (
    <div className="bg-black h-screen flex flex-col w-full px-[4%] py-[3%] select-none">
      <TopImg
        style="bg-[url(/images/bg/back4.png)] bg-no-repeat h-[125px] w-full rounded-[10px] items-center bg-cover justify-center flex"
        amount="324,293"
        img="/images/bg/coin.png"
      />
      {/* <SolanaConnectModal title={"Solana"} icon={"/images/bg/coin.png"} /> */}
      <ConnectWallets />

      {/* <Summary /> */}
      <div className="flex flex-col gap-3  overflow-y-scroll">
        <div className="flex flex-col items-start mt-5">
          <p className="text-[16px] text-white font-bold ">
            Free daily boosters
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div
            onClick={handlefullenergy}
            className="w-full border-[1px] rounded-[12px] px-[24px] py-4 bg-[#0C0C0D] border-white border-opacity-20 flex flex-row justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <Image src="/images/aura.png" alt="" width={40} height={40} />
              <div className="flex flex-col text-white ">
                <p className="text-[17px]">Full energy</p>
                <div className="flex flex-row gap-2 items-center">
                  <span className="flex flex-row gap-1 items-center">
                    <p className="text-[14px]">{fullenergy}/6 available</p>
                  </span>
                </div>
              </div>
            </div>
            <TbChevronRight className="text-white" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col items-start mt-2">
            <p className="text-[16px] text-white font-bold">Boosters</p>
          </div>
          <div className="flex flex-col gap-2">
            <Card
              title={"Multitap"}
              name={"point_level"}
              level={pointLevel + 1}
              price={1000 * Math.pow(2, pointLevel)}
              img={"/images/hand.png"}
            ></Card>
          </div>
          <div className="flex flex-col gap-2">
            <Card
              title={"Energy Limit"}
              name={"energy_level"}
              level={energyLevel + 1}
              price={5000 * Math.pow(2, energyLevel)}
              img={"/images/battery.svg"}
            ></Card>
          </div>
          <div className="h-[100px]"></div>
        </div>
      </div>
    </div>
  );
};

export default Boostpage;

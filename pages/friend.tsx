import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import axios from "../app/axios";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import TopImg from "@/app/components/Reusable/TopImg";
import { setTempMount } from "@/redux/reducers/UsersReducer";
interface Item {
  tgid: string;
  mount: number;
}

function Friend() {
  const user = useSelector((x: any) => x.TaskReducer.user);
  const userdata = useSelector((x:any) => x.UsersReducer.currentUser);
  const [items, setItems] = useState<Item[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const tempMount = useSelector((x:any) => x.UsersReducer.tempMount);
  const [mount, setMount] = useState<number>(tempMount);
  const [energyLevel, setEnergyLevel] = useState<number>(userdata.energy_level);
  const maxEnergy = 1000 + 500*energyLevel;
  const dispatch = useDispatch();
  const snackbar = useSnackbar();
  useEffect(() => {
    if (mount < maxEnergy) {
      const intervalId = setInterval(() => {
        setMount((prevMount) => Math.min(prevMount + 1, maxEnergy)); // Ensure mount doesn't exceed 1000
        dispatch(setTempMount(mount));
        console.log("--------mount--------",mount)
        
      }, 1500); // Adjust the interval as needed

      return () => clearInterval(intervalId); // Clean up the interval on unmount

    }
  }, [mount]);
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const response = await axios.post(
          "https://tongym-be-ekfd.onrender.com/friends",
          {
            user,
          }
        );
        if (response.data.items == undefined) setItems([]);
        else setItems(response.data.items);
      }
    };
    fetchData();
  }, [user]);

  const handleInviteClick = async () => {
    // Generate the invite link
    // const { data } = await axios.get(
    //   "https://tongym-be-ekfd.onrender.com/users"
    // );
    // const item = data.find((item: any) => item.tgid === user); // Adjust the condition if needed
    // console.log(item);

    const inviteLink = `https://t.me/0x00000000000000000000000000000000000000_coin_bot?start=${userdata.id}\nPlay with me, grow a cat and earn $OTP`;

    // function copyToClipboard(text:string) {
    //   const tempInput = document.createElement("textarea");
    //   tempInput.value = text;
    //   document.body.appendChild(tempInput);
    //   tempInput.select();
    //   document.execCommand("copy");
    //   document.body.removeChild(tempInput);
    //  }
    //  copyToClipboard( inviteLink);
    function fallbackCopyTextToClipboard(text:string) {
      var textArea = document.createElement("textarea");
      textArea.value = text;
      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
          document.execCommand('copy');
          console.log('Fallback: Copying text command was successful');
      } catch (err) {
          console.error('Fallback: Oops, unable to copy', err);
      }
      document.body.removeChild(textArea);
    }
  
    function copyTextToClipboard(text:string) {
      if (!navigator.clipboard) {
          fallbackCopyTextToClipboard(text);
          return;
      }
      navigator.clipboard.writeText(text).then(function() {
          console.log('Async: Copying to clipboard was successful!');
      }, function(err) {
          console.error('Async: Could not copy text: ', err);
      });
    }
    fallbackCopyTextToClipboard(inviteLink);
    copyTextToClipboard(inviteLink);
    // Show the invite link in a snackbar or modal
    // enqueueSnackbar("Invite link copied to clipboard!", {autoHideDuration: 1000, variant: "success" });
    // const handleCopy = () => {
    //   if (user?.referalLink) {
    //     // Use Telegram Web Apps API to show the share modal
    //     const shareLink = `https://t.me/share/url?url=${encodeURIComponent(user?.referalLink)}`;
  
    //     // Open the share link in a new window
    //     window.open(shareLink, '_blank');
    //   }
    // };
    
    // Copy the link to the clipboard
    const shareLink = `https://t.me/share/url?url=${encodeURIComponent(
      inviteLink
    )}`;

    // Open the share link in a new window
    window.open(shareLink, "_blank");
  };
  const handleClipClick = async () => {
    // Generate the invite link
    // const { data } = await axios.get(
    //   "https://tongym-be-ekfd.onrender.com/users"
    // );
    // const item = data.find((item: any) => item.tgid === user); // Adjust the condition if needed
    // console.log(item);

    const inviteLink = `https://t.me/0x00000000000000000000000000000000000000_coin_bot?start=${userdata.id}\nPlay with me, grow a cat and earn $OTP`;


    function fallbackCopyTextToClipboard(text:string) {
      var textArea = document.createElement("textarea");
      textArea.value = text;
      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
          document.execCommand('copy');
          console.log('Fallback: Copying text command was successful');
      } catch (err) {
          console.error('Fallback: Oops, unable to copy', err);
      }
      document.body.removeChild(textArea);
    }
  
    function copyTextToClipboard(text:string) {
      if (!navigator.clipboard) {
          fallbackCopyTextToClipboard(text);
          return;
      }
      navigator.clipboard.writeText(text).then(function() {
          console.log('Async: Copying to clipboard was successful!');
      }, function(err) {
          console.error('Async: Could not copy text: ', err);
      });
    }
    fallbackCopyTextToClipboard(inviteLink);
    copyTextToClipboard(inviteLink);
    snackbar.enqueueSnackbar(
      `Copy Referral Link To Clipboard `,
      { autoHideDuration: 1000, variant : "success" }
    );
    
  };

  return (
    <>
      <div className="flex flex-col px-[3%] bg-black flex-1 h-0 overflow-auto">
        <TopImg
          style='bg-[url(/images/bg/back3.png)] h-[125px] w-full bg-cover rounded-[10px] items-center justify-center flex'
          img='/images/bg/coin.png'
          amount='324,293'
        />
        <div className='flex flex-col items-center mt-2'>
          <p className='text-[20px] text-white font-bold'>Invite a Friend</p>
          <p className='text-[11px] text-[gray]'>You and your Friend will receive bonuses</p>
        </div>
        
        <div className='fixed bottom-24 left-0 w-full'>
          <div className='px-3 flex gap-3'>
              <button className=' bg-[#CFFF00] w-full py-2 z-50  rounded-[10px] mt-3 flex items-center justify-center' onClick={handleInviteClick}>
                  <div className='flex flex-row items-center gap-3'>
                      <Image src={"/images/friendicon.svg"} width={35} height={35} alt=''  />
                      <p className='text-[20px]'>INVITE A FRIEND</p>
                  </div>
              </button>
              <button className=' bg-[#CFFF00] w-[100px] py-2 z-50  rounded-[10px] mt-3 flex items-center justify-center' onClick={handleClipClick}>
                  <div className='flex flex-row items-center gap-3'>
                      <Image src={"/images/copy.svg"} width={35} height={35} alt=''  />
                      
                  </div>
              </button>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
        <div className="w-full  rounded-[12px] px-4 py-2 bg-[#0C0C0D] border-[1px] border-white border-opacity-20 flex flex-row items-center gap-x-3">
          <Image src="/images/frnd2.png" alt="gift" width={40} height={35}></Image>
          <div className="text-white text-sm flex flex-col space-y-2">
            <p className=" text-[14px] text-[#6E6E6E] text-left">
              Invite a friend
            </p>
            <div className="flex items-center space-x-2">
              <img src="/images/bg/coin.png" alt="dollar" className="w-6 h-6"></img>
              <div className=" text-[16px] text-white">+10,000</div>
              <div className="font-medium text-[12px] text-[#4B4B4B]">
                for you and your friend
              </div>
            </div>
          </div>
        </div>
        <div className="w-full  rounded-[12px] px-4 py-2 bg-[#0C0C0D] border-[1px] border-white border-opacity-20 flex flex-row items-center gap-x-3">
          <Image src="/images/frnd2.png" alt="gift" width={40} height={35}></Image>
          <div className="text-white text-sm flex flex-col space-y-2">
            <p className=" text-[14px] text-[#6E6E6E]">
              Invite a friend with Telegram Premium
            </p>
            <div className="flex items-center space-x-2">
              <img src="/images/bg/coin.png" alt="dollar" className="w-6 h-6"></img>
              <div className=" text-[16px] text-white">
                +70,000
              </div>
              <div className="font-medium text-[12px] text-[#4B4B4B]">
                for you and your friend
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className='mt-4 text-[20px] text-white font-bold'>List of your friends</p>
      {items.length === 0 ? (
        <>
          <div className="font-medium text-[14px] text-[#6E6E6E] mt-3 mb-[25px]">
            You haven&apos;t invited anyone yet
          </div>
          
        </>
      ) : (
          <div className="mb-[100px]">
            
            {items.map((item, index) => (
              <div key={index}>
                <div className="flex flex-row items-center mt-2 bg-black border border-[#DFDCD5] border-opacity-30 p-2 px-4 rounded-lg">
                  <div className="text-white text-lg">{index + 1}.</div>
                  <div className="ml-4 text-white font-bold">{item.tgid}</div>
                  <img
                    src="/images/bg/coin.png"
                    alt="dollar"
                    className="w-4 h-4 ml-6"
                  ></img>
                  <div className="ml-2 text-white">{item.mount}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Friend;

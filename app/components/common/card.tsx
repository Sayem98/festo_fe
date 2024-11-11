"use Client";

import React, { Ref, forwardRef, useRef, useState } from "react";

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
  description?: String;
  price: string;
  link: string;
  img: string;
  onLoad: () => void;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Card({ title, description, price, link, img, onLoad }: CardProps) {
  const user = useSelector((x: any) => x.TaskReducer.user);
  const snackbar = useSnackbar();
  const [open, setOpen] = useState(false);
  const [doing, setDoing] = useState(false);
  const forceRef = useRef(null);
  const dispatch = useDispatch();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBonus = () => {
    setDoing(true);
    axios
      .post("https://tongym-be-ekfd.onrender.com/bonus", {
        user,
        title,
        price,
      })
      .then(async (response: any) => {
        console.log(response.data);
        if (response.data.stats == "success") {
          const response = await axios.post(
            `https://tongym-be-ekfd.onrender.com/tgid`,
            {
              user: user,
            }
          );
          // dispatch(useSelector())response.data;
          dispatch(setCurrentUser(response.data));
          snackbar.enqueueSnackbar(
            `You gain ${price} coins.  Your balance is ${response.data.mount}`,
            { autoHideDuration: 1000, variant: "success" }
          );
        } else
          snackbar.enqueueSnackbar("You need to wait 24 hours for next time", {
            autoHideDuration: 1000,
            variant: "warning",
          });

        // setTimeout(() => (forceRef?.current as any).click(), 1000);
        setOpen(false);
        setDoing(false);
        setTimeout(() => (forceRef?.current as any).click(), 1000);
        setOpen(false);
        setDoing(false);
      });

    var deepLink = getDeepLink(link);
    console.log(deepLink);
    window.location.href = deepLink;
  };
  const getDeepLink = (link: string) => {
    if (link.includes("t.me") || link.includes("telegram.me")) {
      // Telegram deep link for channels, chats, and users
      const username = link.split(".me/")[1]; // Extract the username from the link
      return `tg://resolve?domain=${username}`;
    } else if (link.includes("x.com") || link.includes("twitter.com")) {
      // X (Twitter) deep link for user profiles
      const username = link.split(".com/")[1]; // Extract the username from the link
      return `twitter://user?screen_name=${username}`;
    } else if (link.includes("youtube.com") || link.includes("youtu.be")) {
      // YouTube deep link for specific videos
      const videoIdMatch = link.match(/(v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (videoIdMatch) {
        const videoId = videoIdMatch[2]; // Extract the video ID
        return `vnd.youtube:${videoId}`;
      }
      // YouTube channel link handling
      if (
        link.includes("/channel/") ||
        link.includes("/c/") ||
        link.includes("/user/")
      ) {
        return link; // Opens YouTube link in app or browser if no video ID is specified
      }
    } else if (link.includes("tiktok.com")) {
      // TikTok profile link using the standard URL format
      const usernameMatch = link.match(/tiktok\.com\/@([a-zA-Z0-9._-]+)/);
      if (usernameMatch) {
        const username = usernameMatch[1]; // Extract the username
        return `https://www.tiktok.com/@${username}`;
      }
    } else if (link.includes("instagram.com")) {
      // Instagram deep link
      const username = link.split(".com/")[1]; // Extract the username from the link
      return `instagram://user?username=${username}`;
    } else if (link.includes("facebook.com")) {
      // Facebook deep link
      return link.replace("https://www.facebook.com", "fb://profile");
    }
    // Return the original link if no deep link is matched
    return link;
  };

  return (
    <>
      <div
        className="select-none w-full border-[1px] border-white border-opacity-20 rounded-[12px] px-4 py-[2px] bg-[#0C0C0D] flex flex-row justify-between gap-x-2 items-center "
        onClick={handleClickOpen}
      >
        <div className="py-2 gap-4 flex items-center">
          <div className=" rounded-lg">
            <Image
              src={img}
              alt=""
              width={40}
              height={40}
              className=" rounded-lg"
            />
          </div>
          <div className="flex flex-col text-white">
            <p className="text-[14px]"> {title}</p>
            <div className="flex flex-row gap-2 items-center">
              <span className="flex flex-row items-center">
                <Image
                  src="/images/bg/coin.png"
                  width={20}
                  height={20}
                  alt=""
                />
                <b className="text-[17px]">
                  +{Intl.NumberFormat("en-US").format(Number(price))}
                </b>
              </span>
            </div>
          </div>
        </div>
        {/* <TbChevronRight className='text-white' /> */}
        <TbChevronRight className="text-white" />
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
                {description}
              </span>
              <a
                ref={forceRef}
                className="text-black opacity-0"
                target="_self"
                href={link}
              >
                dd
              </a>
              <span className="mt-[61px] font-semibold text-[16px] leading-[16px] text-[#6E6E6E]">
                Reward
              </span>
              <span className="flex justify-center space-x-[10.61px] items-center mt-[18.5px] font-bold text-[29px] leading-[29px] text-[#CFFF00]">
                <img
                  src="/images/bg/coin.png"
                  alt="dollar"
                  className="w-[31.84px] h-[31.84px]"
                />
                <div>+{Intl.NumberFormat("en-US").format(Number(price))}</div>
              </span>
              <span className="flex justify-center mt-[29.08px]">
                <button
                  className="px-4 h-[82px] font-semibold text-[24px] bg-[#CFFF00] text-black rounded-[16px] transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed w-full"
                  onClick={handleBonus}
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

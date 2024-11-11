import type { AppProps } from "next/app";
import "../app/globals.css";
import { SnackbarProvider } from "notistack";
import axios from "@/app/axios";
// import Header from "./Header";
import Top from "@/app/components/Reusable/Top";
// import Footer from "./Footer";
import Footer from "@/app/components/Reusable/Footer";
import { persistor, store } from "../redux";
import {
  Provider as StoreProvider,
  useDispatch,
  useSelector,
} from "react-redux";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { setTasks, setUser } from "@/redux/reducers/TaskReducer";
import { PersistGate } from "redux-persist/integration/react";
import { setCurrentUser, setUsers } from "@/redux/reducers/UsersReducer";
import { setBuilds, setThings } from "@/redux/reducers/BuildReducer";
import router from "next/router";
import SolanaContext from "@/app/configs/SolanaContext";
import { WagmiProvider } from "wagmi";
import { config } from "../config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setRate } from "@/redux/reducers/TaskReducer";
const queryClient = new QueryClient();
declare const window: any;
const AppWrapper = ({ Component, pageProps }: any) => {
  const dispatch = useDispatch();
  const isLoadedUser = useSelector((x: any) => x.UsersReducer.isLoadedUser);

  const isLoadedtask = useSelector((x: any) => x.TaskReducer.isLoadedtask);
  const [isMobile, setIsMobile] = useState(false);
  const userFromQuery = router.query.user?.toString() || "";
  useEffect(() => {
    const { userAgent } = window.navigator;
    setIsMobile(userAgent.includes("Mobi"));

    const func = async () => {
      const { data } = await axios.get(
        "https://tongym-be-ekfd.onrender.com/tasks"
      );
      dispatch(setTasks(data));
    };
    const funcRate = async () => {
      const { data } = await axios.get(
        "https://tongym-be-ekfd.onrender.com/rate"
      );
      dispatch(setRate(data));
    };

    const funcUsers = async () => {
      // alert("s")
      const { data } = await axios.get(
        "https://tongym-be-ekfd.onrender.com/users"
      );
      dispatch(setUsers(data));
    };
    const fetchData = async () => {
      if (userFromQuery) {
        const { data } = await axios.get(
          "https://tongym-be-ekfd.onrender.com/users"
        );
        const item = data.find((item: any) => item.tgid === userFromQuery); // Adjust the condition if needed
        dispatch(setUser(item.tgid));
        console.log("111111111111111111111", item);
        dispatch(setCurrentUser(item));
      }
    };
    const fetch = async () => {
      if (userFromQuery) {
        const response = await axios.post(
          `https://tongym-be-ekfd.onrender.com/tgid`,
          {
            user: userFromQuery,
          }
        );
        // console.log("sdfsdf------------",userdata);
        dispatch(setCurrentUser(response.data));
      }
    };
    const funcThings = async () => {
      const { data } = await axios.get(
        "https://tongym-be-ekfd.onrender.com/things"
      );
      dispatch(setThings(data));
    };
    const funcBuilds = async () => {
      const { data } = await axios.get(
        "https://tongym-be-ekfd.onrender.com/builds"
      );
      dispatch(setBuilds(data));
    };

    funcUsers();
    funcThings();
    funcBuilds();
    func();
    fetchData();
    fetch();
    funcRate();
  }, []);

  useEffect(() => {
    function buttonOn() {
      // do something on btn click
    }
    // let main_page = document.querySelector("#main_page");
    // alert(main_page);

    // if (main_page) {
    //   window.Telegram.WebApp.expand(); //expand window after page loading
    //   console.log(window.Telegram.WebApp);

    //   window.Telegram.WebApp.MainButton.onClick(buttonOn); //set func on main button click
    //   window.Telegram.WebApp.MainButton.setParams({ text: "Корзина" }); // set byn params
    //   window.Telegram.WebApp.MainButton.show(); //show telegram btn
    // }
    const tele = window?.Telegram?.WebApp;
    tele?.expand();
  });

  return isMobile ? (
    !isLoadedtask ? (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    ) : (
      <Component {...pageProps} />
    )
  ) : (
    <div className="flex flex-col space-y-5 justify-center items-center fixed top-0 left-0 w-full h-full bg-[#191C73] bg-opacity-20 backdrop-blur-lg z-[2]">
      <img className="max-w-[186px]" src="/images/crying.svg" />
      <span>Not available in PC.</span>
    </div>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <StoreProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SnackbarProvider>
              {/* <Top /> */}
              <AppWrapper Component={Component} pageProps={pageProps} />
              <Footer />
            </SnackbarProvider>
          </PersistGate>
        </StoreProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

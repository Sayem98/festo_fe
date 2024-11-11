"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useBalance} from "wagmi";
import ocicat from '../ABI/ocicat.json'
// import Buildpage from '@/app/components/Build/Buildpage';
// import Friendpage from '@/app/components/Friends/Friendpage';
import Growpage from '@/app/components/Grow/Growpage';
// const LEVEL_STEP = 5000;
const Build: React.FC = () => {
    // const data = useBalance({
    //     address: '0xcd1591A21864979ed7038B5876dA374f90eBe655',
    //     token: '0x37Fe635D1e25B2F7276C1B9dBBcc7b087f80C050',
        
    // })
    
    // console.log("-----------------------"+ Number(data.data?.value)/(10**18));
    return(
        <Growpage/>
    )
}
export default Build;
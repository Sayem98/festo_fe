import Image from 'next/image'
import React from 'react'
import { useSelector } from 'react-redux';
import Cardbuild from '../common/cardbuild';

const Landscape = () => {
    const things = useSelector((x:any) => x.BuildReducer.things);
    const builds = useSelector((x:any) => x.BuildReducer.builds);
    const user = useSelector((x:any)=> x.TaskReducer.user);
    // const currentUser = useSelector((x:any) => x.UsersReducer.currentUser);
    // console.log("?????????????", user)
    const landscape =things?.filter((x:any) => x.kind === "Landscape")
    const mybuilds = builds?.filter((x:any) => x.tgid === user)
    // console.log("?????????????", landscape)

    const dataland = landscape.map((item:any) => {
        const title = item.tname;
        const img = item.img_url;
        
        let level = 0;
        
        // console.log(">>>>>title", title);

        const buildone = mybuilds?.filter((x:any) => x.tname === title );
        // console.log(">>>>>buildone", buildone);
        if(buildone.length>0){
            level = buildone[0].tlevel;
        }
        const current_reward = item.original_reward + item.step_reward * level;
        const stepRward = item.step_reward;
        const next_payment = item.original_payment + item.step_payment * level;
        return {title:title,img:img, level:level, reward:current_reward,stepRward:stepRward, payment:next_payment };
    })
    // console.log("sdfsdfs", dataland);

    
    return (
        <div className='grid grid-cols-2 w-full gap-2'>
            {
                dataland.map((d:any, i:number) => (
                    <div key={i} >
                        <Cardbuild 
                        key={i}
                        title={d.title} 
                        img={d.img} 
                        level={d.level} 
                        reward={d.reward} 
                        stepReward={d.stepRward}
                        payment={d.payment}                        />

                    </div>
                ))
            }
        </div>
    )
}

export default Landscape

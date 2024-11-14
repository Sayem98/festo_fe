'use Client'

import YoutubeCard from '@/app/components/common/youtubecard'
import { useSelector } from 'react-redux'

function Earn() {
  const allTasks = useSelector((x: any) => x.TaskReducer.tasks)
  const extraTasks = allTasks?.filter((x: any) => x.extra === true)
  const user = useSelector((x: any) => x.TaskReducer.user)

  const handleImageLoad = () => {}

  return (
    <div className='flex-1 h-0'>
      <div className='py-[30px] mb-[90px] px-5 text-white rounded-t-3xl border-t border-[#DFDCD5] bg-[#F3EFE6] h-full overflow-auto'>
        <div className='font-bold text-[42px] text-center text-[#CFFF00]'>
          Learn To Earn
        </div>
        <div className='pb-[26px] font-medium text-[14px] text-center text-[#6E6E6E]'>
          Listen and learn
        </div>

        {extraTasks.map((x: any, i: number) => (
          <YoutubeCard
            key={i}
            title={x.title}
            description={x.description}
            price={x.price}
            link={x.link}
            img={x.image}
            onLoad={handleImageLoad}
          />
        ))}
      </div>
    </div>
  )
}

export async function getStaticProps() {
  return {
    props: {
      data: {},
    },
  }
}

export default Earn

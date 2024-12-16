'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Spotlight } from "../../Components/spotlight";
import { TextGenerateEffect } from "../../Components/text-generate-effect";
import ButtonComponent from '@/Components/button';


const EmotionResponse: React.FC = () => {
  const searchParams = useSearchParams();
  const emotions = searchParams.get('emotions');
  let dominantEmotion = 'No emotions received';
  let emotionList = 'No emotions received';
  const router = useRouter();

  if (emotions) {
    try {
      const parsedEmotions = JSON.parse(emotions);
      dominantEmotion = parsedEmotions.dominant_emotion;
      emotionList = parsedEmotions.emotions
        .map((item: { emotion: string, percentage: number }) => {
          return `${item.emotion}: ${item.percentage.toFixed(2)}%`;
        })
        .join(', ');

    } catch (error) {
      console.error('Error parsing emotions:', error);
    }
  }

  return (
  <div className="h-screen w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white"/>
        <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
            <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                AI Response
            </h1>
            <div className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto" >
                <TextGenerateEffect words={`I think your dominant emotion right now is ${dominantEmotion}`} />
            </div>
            <div className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto" >
                <TextGenerateEffect words={`Emotions analysis: ${emotionList}`} />
            </div>
            <div className="flex md:justify-center pt-20 ">
                <ButtonComponent onClick={() => { router.push(`/`);} } title='Click here to go back'/>
            </div>
                
            
        </div>
    </div>
  );
};

export default EmotionResponse;


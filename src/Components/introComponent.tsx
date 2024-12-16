"use client";
import React, { useRef, useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Spotlight } from "./spotlight";
import { TextGenerateEffect } from "./text-generate-effect";
import ButtonComponent from './button';
import { useRouter } from 'next/navigation';

const IntroductionComponent: React.FC = () => {
  const router = useRouter();
    // Audio setup not finished
    // const [audioPlayed, setAudioPlayed] = useState(false);
    // const audioRef = useRef<HTMLAudioElement | null>(null);

    // const playAudio = () => {
    //     const audio = new Audio("/BackgroundAudio.mp3");
    //     audioRef.current = audio;
    //     audio.play().then(() => {
    //     console.log("Audio playing with user interaction!");
    //     setAudioPlayed(true);
    //     }).catch((err) => {
    //     console.warn("Autoplay failed even with user interaction.");
    //     });
    // };
    const words = `I'm Emotion_Model_v3 — an AI designed to understand human emotions by analyzing pictures.`;
  return (
    <div className="h-screen w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Welcome
        </h1>
        <div className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto" >
            <TextGenerateEffect words={words} />
        </div>
        <div className="flex md:justify-center pt-20 ">
          <ButtonComponent onClick={() => { router.push(`/TakePicture`);} } title='Click here to start'/>
          </div>

        {/* adding audio is in middle */}
        {/* {!audioPlayed && (
          <button
            onClick={playAudio}
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Play Audio
          </button>
        )} */}
      </div>
    </div>
  );
};

export default IntroductionComponent;

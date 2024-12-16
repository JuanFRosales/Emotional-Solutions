"use client"
import CameraComponent from "@/Components/cameraComponent";
import { useRouter } from "next/router";

import { useState } from "react";

const PicturePage = () => {
  return(
    <div>
      <CameraComponent />
    </div>
  );
};
export default PicturePage;

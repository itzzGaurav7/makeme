"use client"
import Image from "next/image";
import { ModeToggle } from "./Component/ModeToggle";
import DropZone from './Component/DropZone/DropBox'

export default function Home() {
  return (
    <div className="relative w-full h-screen">
      <div className="absolute right-3 top-3">
        <ModeToggle/>
      </div>
      <div className="relative top-10">
        <DropZone/>
      </div>
    </div>
  );
}

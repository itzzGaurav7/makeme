"use client"
import Image from "next/image";
import { ModeToggle } from "./Component/ModeToggle";
import DropZone from './Component/DropZone/DropBox'

export default function Home() {
  return (
    <div>
      <div className="absolute right-5 top-5">
        <ModeToggle/>
      </div>
      <div className="relative top-10">
        <DropZone/>
      </div>
    </div>
  );
}

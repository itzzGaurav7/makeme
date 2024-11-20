"use client"
import Image from "next/image";
import { ModeToggle } from "./Component/ModeToggle";
import DropZone from './Component/DropZone/DropBox'

export default function Home() {
  return (
    <div>
      <ModeToggle/>
      <DropZone/>
    </div>
  );
}

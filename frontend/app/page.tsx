"use client";
import { ModeToggle } from "./Component/ModeToggle";
import DropBox from "./Component/DropBox";
import Sidebar from "./Component/Sidebar";
import { DataProvider } from "./Context/DataContext";

export default function Home() {
  return (
    <DataProvider>
      <div className="relative w-full h-screen">
        <div className="absolute right-3 top-3">
          <ModeToggle />
        </div>
        <div className="absolute top-0 left-0">
          <Sidebar />
        </div>
        <div className="relative top-10">
          <DropBox />
        </div>
      </div>
    </DataProvider>
  );
}

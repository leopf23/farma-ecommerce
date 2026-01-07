import Image from "next/image";
import TopBar from "./component/topBar";
import Header from "./component/header";
import Banner from "./component/banner";
import { FaBoxOpen, FaPills, FaAppleAlt, FaBaby } from "react-icons/fa";
import { TbBabyBottle } from "react-icons/tb";
import { CiApple, CiStar } from "react-icons/ci";
import { PiBabyCarriageLight, PiPillLight } from "react-icons/pi";
import { GiMirrorMirror } from "react-icons/gi";
import MultiCard from "./component/multiCard";

export default function Home() {
  const categories = [
    { label: 'Belleza', Icon: CiStar },
    { label: 'Medicamentos', Icon: PiPillLight },
    { label: 'Comestibles', Icon: CiApple },
    { label: 'Bebes', Icon: PiBabyCarriageLight },
  ];

  return (
    <div>
      <TopBar />
      <Header />
      <main className="p-5 md:px-25 min-h-screen">
        <Banner />

        <div className="justify-items-center gap-6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 p-10">
          {categories.map(({ label, Icon }) => (
            <div key={label} className="flex items-center gap-2 hover:bg-[#2c27af09] p-2 rounded-xl text-[#2B27AF] cursor-pointer">
              <Icon size={35} />
              <span className="font-medium text-[14px]">{label}</span>
            </div>
          ))}
        </div>

        <div>
          <MultiCard />
        </div>

      </main>
    </div>
  );
}

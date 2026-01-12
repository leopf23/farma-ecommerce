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
import CardProduct from "./component/cardProduct";
import HorizontalProduct from "./component/horizontalProduct";
import Footer from "./component/footer";

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

        {/* banner home  */}
        <Banner imageUrl={"/banner-web.jpg"} />

        {/* Categories items */}
        <div className="justify-items-center grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 p-10">
          {categories.map(({ label, Icon }) => (
            <div key={label} className="flex items-center hover:bg-[#2c27af09] p-2 rounded-xl text-[#2B27AF] cursor-pointer">
              <Icon size={35} />
              <span className="font-medium text-[14px]">{label}</span>
            </div>
          ))}
        </div>


        {/* MultiCard component */}
        <MultiCard />

        {/* category */}
        <div className="my-15">
          <h2 className="p-10 font-bold text-[#373577] text-2xl text-center">Categorias populares</h2>
          <div className="flex md:flex-row flex-col justify-center gap-5">
            <span className="items-center self-center bg-[#ECF4F6] hover:bg-[#373577] px-5 py-2 rounded-full text-[#373577] text-[1rem] hover:text-white cursor-pointer">suplementos</span>
            <span className="items-center self-center bg-[#ECF4F6] hover:bg-[#373577] px-5 py-2 rounded-full text-[#373577] text-[1rem] hover:text-white cursor-pointer">Medicamentos</span>
            <span className="items-center self-center bg-[#ECF4F6] hover:bg-[#373577] px-5 py-2 rounded-full text-[#373577] text-[1rem] hover:text-white cursor-pointer">Belleza</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 mb-15">
          <CardProduct image="/profile.png" category="Proteina" title="Premium whey Proteina" price={100} />
          <CardProduct image="/profile.png" category="Proteina" title="BCAA Aminoácido..." price={1500} />
          <CardProduct image="/profile.png" category="Proteina" title="Multi-vitaminas" price={3000} />
          <CardProduct image="/profile.png" category="Proteina" title="Premium whey Proteina" price={4000} />
          <CardProduct image="/profile.png" category="Proteina" title="BCAA Aminoácido..." price={7000} />
        </div>

        {/* Banner section */}
        <div>
          <Banner
            height="h-45"
            width="w-full"
            imageUrl={"/banner2.png"} />
        </div>


        {/* prodcutos destacados */}
        <h2 className="my-20 font-bold text-[#373577] text-2xl text-center">Productos destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 mb-15">
          <CardProduct image="/profile.png" category="Proteina" title="Premium whey Proteina" price={100} />
          <CardProduct image="/profile.png" category="Proteina" title="BCAA Aminoácido..." price={1500} />
          <CardProduct image="/profile.png" category="Proteina" title="Multi-vitaminas" price={3000} />
          <CardProduct image="/profile.png" category="Proteina" title="Premium whey Proteina" price={4000} />
          <CardProduct image="/profile.png" category="Proteina" title="BCAA Aminoácido..." price={7000} />
          <CardProduct image="/profile.png" category="Proteina" title="Premium whey Proteina" price={100} />
          <CardProduct image="/profile.png" category="Proteina" title="BCAA Aminoácido..." price={1500} />
          <CardProduct image="/profile.png" category="Proteina" title="Multi-vitaminas" price={3000} />
          <CardProduct image="/profile.png" category="Proteina" title="Premium whey Proteina" price={4000} />
          <CardProduct image="/profile.png" category="Proteina" title="BCAA Aminoácido..." price={7000} />
        </div>


        {/* more products for you  */}
        <h2 className="my-15 font-bold text-[#373577] text-2xl text-center">Más productos para ti</h2>
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-15">
          <HorizontalProduct image="/profile.png" title="Premium whey Proteina" price={100} />
          <HorizontalProduct image="/profile.png" title="Premium whey Proteina" price={100} />
          <HorizontalProduct image="/profile.png" title="Premium whey Proteina" price={100} />
        </div>
      </main>

      {/* footer */}
      <Footer />
    </div>
  );
}

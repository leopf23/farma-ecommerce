import Banner from "../component/banner";
import MultiCard from "../component/multiCard";
import CardProduct from "../component/cardProduct";
import HorizontalProduct from "../component/horizontalProduct";

import { CiApple, CiStar } from "react-icons/ci";
import { PiBabyCarriageLight, PiPillLight } from "react-icons/pi";

export default function Home() {
  const categories = [
    { label: "Belleza", Icon: CiStar },
    { label: "Medicamentos", Icon: PiPillLight },
    { label: "Comestibles", Icon: CiApple },
    { label: "Bebes", Icon: PiBabyCarriageLight },
  ];

  return (
    <>
      {/* Banner */}
      <Banner imageUrl="/banner-web.jpg" />

      {/* Categorías */}
      <div className="justify-items-center gap-6 grid grid-cols-2 lg:grid-cols-4 p-10">
        {categories.map(({ label, Icon }) => (
          <div
            key={label}
            className="flex items-center gap-2 hover:bg-[#2c27af09] p-3 rounded-xl text-[#2B27AF] cursor-pointer"
          >
            <Icon size={35} />
            <span className="font-medium text-sm">{label}</span>
          </div>
        ))}
      </div>

      {/* MultiCard */}
      <MultiCard />

      {/* Categorías populares */}
      <section className="my-16 text-center">
        <h2 className="mb-6 font-bold text-[#373577] text-2xl">
          Categorías populares
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {["Suplementos", "Medicamentos", "Belleza"].map((cat) => (
            <span
              key={cat}
              className="bg-[#ECF4F6] hover:bg-[#373577] px-5 py-2 rounded-full text-[#373577] hover:text-white cursor-pointer"
            >
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* Productos */}
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 mb-20">
        <CardProduct image="/producto.png" category="Proteina" title="Premium whey Proteina" price={100} />
        <CardProduct image="/producto.png" category="Proteina" title="BCAA Aminoácido" price={1500} />
        <CardProduct image="/producto.png" category="Proteina" title="Multi-vitaminas" price={3000} />
        <CardProduct image="/producto.png" category="Proteina" title="Premium whey Proteina" price={4000} />
        <CardProduct image="/producto.png" category="Proteina" title="BCAA Aminoácido" price={7000} />
      </div>

      {/* Banner secundario */}
      <Banner height="h-46" imageUrl="/banner2.png" />

      {/* Más productos */}
      <h2 className="my-10 font-bold text-[#373577] text-2xl text-center">
        Más productos para ti
      </h2>

      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-20">
        <HorizontalProduct image="/producto.png" title="Premium whey Proteina" price={100} />
        <HorizontalProduct image="/producto.png" title="Premium whey Proteina" price={100} />
        <HorizontalProduct image="/producto.png" title="Premium whey Proteina" price={100} />
      </div>
    </>
  );
}

import TopBar from "../component/topBar";
import Header from "../component/header";
import Footer from "../component/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Top bar */}
      <TopBar />

      {/* Header principal */}
      <Header />

      {/* Contenido dinámico */}
      <main className="flex-1 px-5 md:px-25 w-full min-h-screen flex flex-col">
        {children}
      </main>

      {/* Footer global */}
      <Footer />
    </>
  );
}

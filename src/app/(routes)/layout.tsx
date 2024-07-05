import Sidebar from "@/components/sidebar/sidebar";
import Navbar from "@/components/Header/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="h-[calc(100vh-4rem)] flex bg-background">
        <Sidebar />
        {children}
      </main>
    </>
  );
}

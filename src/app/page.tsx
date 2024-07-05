import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen grid place-items-center">
      <div className="flex flex-col">
        <h1 className="text-5xl text-muted-foreground">CYRUS</h1>
        <Link
          href={"/aaryan"}
          className="mx-auto mt-4 w-fit py-3 px-6 rounded-md text-sm border hover:bg-muted"
        >
          Get Yours
        </Link>
      </div>
    </main>
  );
}

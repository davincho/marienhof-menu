import Link from "next/link";

export default async function Page() {
  return (
    <div className="container mx-auto p-4 h-screen">
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-col w-full md:w-1/2">
          <h1 className="text-5xl mb-10 text-center">I am hungry</h1>
          <Link
            href="/marie"
            className="border-slate-400 border-2 text-4xl rounded-md p-2 w-full mb-3 text-center"
          >
            🧑🏼‍🍳 Marienhof
          </Link>
          <Link
            href="/paul"
            className="border-slate-400 border-2 text-4xl rounded-md p-2 w-full text-center"
          >
            🐵 Paul and the Monkeys
          </Link>
        </div>
      </div>
    </div>
  );
}

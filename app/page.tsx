import Link from "next/link";

const commonLinkStyle =
  "border-gray-200 hover:border-gray-400 border-2 text-4xl rounded-md p-2 w-full text-center";

export default async function Page() {
  return (
    <div className="container mx-auto p-4 h-screen">
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-col w-full md:w-1/2">
          <h1 className="text-5xl mb-10 text-center font-heading">
            I am hungry!!1
          </h1>
          <Link href="/marie" className={`${commonLinkStyle} mb-3`}>
            🧑🏼‍🍳 Marienhof
          </Link>
          <Link href="/paul" className={`${commonLinkStyle}`}>
            🐵 Paul and the Monkeys
          </Link>
        </div>
      </div>
    </div>
  );
}

import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

const commonLinkStyle =
  "border-gray-200 hover:border-gray-400 border-2 text-4xl rounded-md p-2 w-full text-center";

const VALID_DOMAINS = new Map<string, string>([
  ["marienify.vercel.app", "/marie"],
  ["limonis.vercel.app", "/limonis"],
]);

export default async function Page() {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host");

  if (host) {
    const redirectUrl = VALID_DOMAINS.get(host);

    if (redirectUrl) {
      redirect(`https://iamhungry.vercel.app/${redirectUrl}`);
    }
  }

  return (
    <div className="container mx-auto h-screen p-4">
      <div className="flex h-full items-center justify-center">
        <div className="flex w-full flex-col md:w-2/3 xl:w-1/2">
          <h1 className="mb-10 text-center font-heading text-5xl">
            I am hungry!!1
          </h1>
          <div className="flex flex-col gap-3 lg:flex-row">
            <Link href="/marie" className={`${commonLinkStyle}`}>
              🧑🏼‍🍳 Marienhof
            </Link>
            <Link href="/limonis" className={`${commonLinkStyle}`}>
              🍋 Limonis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { kv } from "@vercel/kv";
import { revalidateTag } from "next/cache";

import { notFound } from "next/navigation";

export default async function Upload({ searchParams }: { searchParams: any }) {
  if (searchParams.key !== process.env.UPLOAD_KEY) {
    notFound();
  }

  async function storeFile(data: FormData) {
    "use server";

    if (searchParams.key !== process.env.UPLOAD_KEY) {
      notFound();
    }

    console.log("Uploading started");

    const response = await fetch("https://temp.sh/upload", {
      method: "POST",
      body: data,
    });

    const newUrl = await response.text();

    console.log(`Uploading finished. Files stored at ${newUrl}`);

    await kv.hset<string>("limonis", {
      url: newUrl,
    });

    revalidateTag("data-limonis");
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="m-8 h-1/2 w-2/3 rounded-md border border-dashed p-8">
        <form
          action={storeFile}
          method="post"
          className="flex flex-col items-center gap-8"
        >
          <h1 className="text-center text-3xl">Select PDF to upload</h1>

          <input type="file" name="uploadfile" id="fileToUpload" />
          <button
            type="submit"
            className="rounded-md bg-blue-700 p-3 hover:bg-blue-600 active:bg-blue-800"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}

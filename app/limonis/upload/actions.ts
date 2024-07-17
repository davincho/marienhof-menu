"use server";

import { del } from "@vercel/blob";

export const deleteFile = async (formData: FormData) => {
  // const urlToDelete = searchParams.get("url") as string;
  // console.log("Deleting", urlToDelete);
  // await del(urlToDelete);

  // return new Response();

  const url = formData.get("url");

  if (url) {
    console.log("Deleting", url);
    await del(url.toString());
  }
};

"use client";

import { useState, useRef } from "react";

import { deleteFile } from "./actions";

export default function Page() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [uploaded, setUploaded] = useState<boolean>(false);

  return (
    <>
      <h1>Upload Limonis Menu</h1>

      <form
        onSubmit={async (event) => {
          event.preventDefault();

          if (!inputFileRef.current?.files) {
            return;
          }

          const file = inputFileRef.current.files[0];

          await fetch(`/limonis/upload/api?filename=${file.name}`, {
            method: "POST",
            body: file,
          });

          setUploaded(true);
        }}
      >
        <input name="file" ref={inputFileRef} type="file" />
        <button type="submit">Upload</button>
      </form>
      {uploaded && <div>Uploaded</div>}

      <form action={deleteFile} className="text-black">
        <input name="url" />
        <button>Delete file</button>
      </form>
    </>
  );
}

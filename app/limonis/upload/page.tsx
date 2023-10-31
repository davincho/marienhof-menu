"use client";

import { useState, useRef } from "react";

export default function Page() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [uploaded, setUploaded] = useState<boolean>(false);
  return (
    <>
      <h1>Upload Your Avatar</h1>

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
    </>
  );
}

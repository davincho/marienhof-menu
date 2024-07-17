"use client";

import React from "react";

const Regenerate = ({}) => {
  return (
    <form
      action={async () => {
        await fetch("/api/revalidate");

        location.reload();
      }}
    >
      <button type="submit">🤓 Regenerate</button>
    </form>
  );
};

export default Regenerate;

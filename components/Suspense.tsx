"use client";

import React, { Suspense } from "react";

const Sus = ({ children }) => {
  return <Suspense fallback={<div>Loading ...</div>}>{children}</Suspense>;
};

export default Sus;

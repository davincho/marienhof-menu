"use client";

import React from "react";

import Head from "next/head";
import Link from "next/link";

import { isProduction } from "./../utils/env";

const Home = ({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="container mx-auto p-3">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="md:w-3/4 mx-auto mb-8">
        <div className="mb-2 md:mb-8 relative grid grid-rows-[42px_1fr] gap-2 md:grid-rows-none md:grid-cols-[80px_1fr_80px] my-3">
          <Link
            className="rounded-md border-gray-200  w-[100px] flex items-center hover:text-sky-300 active:text-sky-500"
            href={isProduction ? "https://iamhungry.vercel.app" : "/"}
          >
            👈🏻 back
          </Link>
          <h1 className="text-3xl text-center font-heading">{title}</h1>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Home;

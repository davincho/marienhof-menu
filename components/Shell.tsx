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
      <div className="mx-auto mb-8 md:w-3/4">
        <div className="relative my-3 mb-2 grid grid-rows-[42px_1fr] gap-2 md:mb-8 md:grid-cols-[80px_1fr_80px] md:grid-rows-none">
          <Link
            className="flex w-[100px]  items-center rounded-md border-gray-200 hover:text-sky-300 active:text-sky-500"
            href={isProduction ? "https://iamhungry.vercel.app" : "/"}
          >
            👈🏻 back
          </Link>
          <h1 className="text-center font-heading text-3xl">{title}</h1>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Home;

"use client";

const TYPE_MAPPING = {
  INTERNATIONAL: "text-amber-900 bg-amber-300",
  SUPPE: "text-emerald-900 bg-emerald-300",
  "WIENER KÜCHE": "text-fuchsia-900 bg-fuchsia-300",
  PASTA: "text-amber-900 bg-amber-300",
  FISCH: "text-blue-900 bg-blue-300",
};

export const paulRenderer = ([type, name, price]: string[]) => (
  <>
    <div>
      <span
        className={`text- inline-block text-xs rounded-md p-1 mr-1 ${
          TYPE_MAPPING[type as keyof typeof TYPE_MAPPING]
        }`}
      >
        {type}
      </span>
      {name}
    </div>
    <div className="ml-2 flex-none text-right">€ {price}</div>
  </>
);

export const marienRenderer = ([name, price]: string[]) => (
  <>
    <div>{name}</div>
    <div className="ml-2 flex-none text-right">€ {price}</div>
  </>
);

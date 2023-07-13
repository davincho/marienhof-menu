const TYPE_MAPPING = {
  INTERNATIONAL: "text-amber-900 bg-amber-300",
  SUPPE: "text-emerald-900 bg-emerald-300",
  "WIENER KÜCHE": "text-fuchsia-900 bg-fuchsia-300",
  PASTA: "text-violet-900 bg-violet-300",
  FISCH: "text-blue-900 bg-blue-300",
};

export const paulRenderer = ([type, name, price]: string[]) => (
  <>
    <div>
      <span
        className={`mr-1 inline-block rounded-md p-1 text-xs ${
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

export const limonisRenderer = ([name, price]: string[]) => (
  <>
    <div>{name}</div>
    <div className="ml-2 flex-none text-right">
      <span className="mr-2 line-through decoration-orange-500">€{price}</span>€{" "}
      {price === "7,20" ? "1,20" : "0,60"}
    </div>
  </>
);

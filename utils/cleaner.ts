const cleaningExpression: [RegExp, string][] = [
  [/(\S)mit /, "$1 mit "],
  [/ mit(\S)/, " mit $1"],
  [/(\S)& /, "$1 & "],
  [/,, /, ", "],
];

const cleaner = (name: string) => {
  let cleansed = name;

  for (const clean of cleaningExpression) {
    const [pattern, substitute] = clean;
    cleansed = cleansed.replace(pattern, substitute);
  }

  return cleansed;
};

export default cleaner;

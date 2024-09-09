import fetch from "node-fetch";
import fs from "fs";
import { formatISO } from "date-fns";

const fetchData = async () => {
  const date = formatISO(new Date(), { representation: "date" }).replace(
    /-/g,
    "/"
  );
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur`;
  const response = await fetch(url);
  const data = await response.json();
  const openPriceEUR = data.ethereum.eur;
  return `${date},${openPriceEUR}`;
};

const prependDataToFile = async (newData) => {
  const existingData = fs.readFileSync("data.csv", "utf8");
  const updatedData = `Date,Open\n${newData}\n${existingData
    .split("\n")
    .slice(1)
    .join("\n")}`;
  fs.writeFileSync("data.csv", updatedData, "utf8");
};

const updateData = async () => {
  const newData = await fetchData();
  await prependDataToFile(newData);
};

updateData().catch(console.error);

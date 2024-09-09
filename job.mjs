import fetch from "node-fetch";
import fs from "fs";
import { format } from "date-fns";

const fetchData = async () => {
  const date = format(new Date(), "MM/dd/yyyy");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur`;
  const response = await fetch(url);
  const data = await response.json();
  const openPriceEUR = data.ethereum.eur;
  return `${date},${openPriceEUR}`;
};

const prependDataToFile = async (newData) => {
  let existingData = fs.readFileSync("data.csv", "utf8");
  existingData = existingData.replace(/\r\n/g, "\n"); // Convert CRLF to LF
  const lines = existingData.split("\n");
  lines[1] = lines[1].replace(/-/g, "/"); // Ensure second line matches new date format
  const updatedData = `Date,Open\n${newData}\n${lines.slice(1).join("\n")}`;
  fs.writeFileSync("data.csv", updatedData, "utf8");
};

const updateData = async () => {
  const newData = await fetchData();
  await prependDataToFile(newData);
};

updateData().catch(console.error);

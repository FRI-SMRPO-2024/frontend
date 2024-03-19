import { DateExtractedData } from "@/types";
import moment from "moment";

const extractFromDateTime = (datetime: string): DateExtractedData => {
  const date = new Date(datetime);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return {
    day,
    month,
    year,
    hours,
    minutes,
    seconds,
  };
};

const formattedDate = (datetime: string): string => {
  const { day, month, year } = extractFromDateTime(datetime);
  return `${day}-${month}-${year}`;
};

const formattedDateTime = (datetime: string) => {
  const { day, month, year, hours, minutes, seconds } =
    extractFromDateTime(datetime);
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const dateIsBetween = (from: string, to: string, comapre: string) => {
  const compareDate = moment(comapre, "DD/MM/YYYY H:is");
  const startDate = moment(from, "DD/MM/YYYY H:i:s");
  const endDate = moment(to, "DD/MM/YYYY H:i:s");

  return compareDate.isBetween(startDate, endDate);
};

export { extractFromDateTime, formattedDate, formattedDateTime, dateIsBetween };

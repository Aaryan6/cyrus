import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";
import moment from "moment-timezone";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
  return url;
};

export const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7
); // 7-character random string

export const formatForGoogleCalendar = (date: string) => {
  return moment.tz(date, "Asia/Kolkata").toISOString();
};

// get time in 12-hour format
export const getFormattedTime = (date: string) => {
  return moment.tz(date, "Asia/Kolkata").format("hh:mm A");
};

// get date in format: 12th Jan, 2022
export const getFormattedDate = (date: string) => {
  return moment.tz(date, "Asia/Kolkata").format("Do MMM, YYYY");
};

// calculate time difference between two dates
export const getTimeDifference = (date1: string, date2: string) => {
  const a = moment(date1);
  const b = moment(date2);
  const diff = a.diff(b, "hours");
  return diff;
};

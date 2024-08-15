"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getFormattedDate,
  getFormattedTime,
  getTimeDifference,
} from "@/lib/utils";
import {
  BotIcon,
  CalendarIcon,
  ChevronDown,
  ChevronUp,
  ClockIcon,
  CopyIcon,
  ListIcon,
} from "lucide-react";
import { useState } from "react";

export type EventsListProps = {
  data: {
    summary?: string | null;
    description?: string | null;
    updated?: string | null;
    timeZone?: string | null;
    defaultReminders?:
      | [
          {
            method: string;
            minutes: number;
          }
        ]
      | any;
    items?:
      | [
          {
            id: string;
            status?: string | null;
            htmlLink?: string | null;
            created?: string | null;
            updated?: string | null;
            summary?: string | null;
            creator: {
              email?: string | null;
              self: boolean;
            };
            organizer: {
              email?: string | null;
              self: boolean;
            };
            start: {
              dateTime?: string | null;
              timeZone?: string | null;
            };
            end: {
              dateTime?: string | null;
              timeZone?: string | null;
            };
            reminders: {
              useDefault: boolean;
            };
            eventType: boolean;
          }
        ]
      | any;
  };
};

type SingleEvent = {
  id?: string | null;
  status?: string | null;
  htmlLink?: string | null;
  created?: string | null;
  updated?: string | null;
  summary?: string | null;
  description?: string | null;
  location?: string | null;
  creator?: {
    email?: string;
    self?: boolean;
    displayName?: string;
    id?: string;
  } | null;
  organizer?: {
    email?: string | null;
    self?: boolean;
  } | null;
  start?: {
    dateTime?: string | null;
    timeZone?: string | null;
  };
  end?: {
    dateTime?: string | null;
    timeZone?: string | null;
  };
  attendees?:
    | [
        {
          email: string;
        }
      ]
    | any;
  hangoutLink?: string | null;
  reminders?:
    | {
        useDefault: boolean;
      }
    | any;
  eventType?: string | null;
};

export function CalendarEvents({ data }: EventsListProps) {
  return (
    <div className="flex-1 flex flex-col gap-4">
      {data.items?.map((item: SingleEvent) => (
        <CalendarCard data={item} key={item.id} />
      ))}
    </div>
  );
}

export const CalendarCard = ({ data }: { data: SingleEvent }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const copyToClipboard = (text: any) => {
    navigator.clipboard.writeText(text);
  };
  return (
    <Card className="w-full max-w-md bg-muted text-foreground">
      <div className="flex flex-row items-center justify-between px-6 py-3">
        <span
          onClick={() => copyToClipboard(data?.id)}
          className="text-xs text-muted-foreground py-0 cursor-pointer"
        >
          {data?.id}
        </span>
        <CopyIcon
          onClick={() => copyToClipboard(data?.id)}
          className="w-3 h-3 cursor-pointer active:text-muted-foreground"
        />
      </div>
      <CardContent className="space-y-4 pb-4">
        <div className="flex items-center space-x-4">
          <CalendarSVG />
          <div>
            <h3 className="text-lg font-semibold">
              {data?.summary || "No title"}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <CalendarIcon className="w-4 h-4" />
              <span>
                {getFormattedDate(data?.start?.dateTime!)} at{" "}
                {getFormattedTime(data?.start?.dateTime!)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-start justify-between">
          <Collapsible open={isExpanded} className="">
            <CollapsibleTrigger
              onClick={() => setIsExpanded(!isExpanded)}
              asChild
            >
              <div className="flex items-center space-x-2 text-sm text-muted-foreground cursor-pointer">
                {!isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4 mb-1" />
                )}
                <span>Details</span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <p className="text-sm">
                {data?.description || "No description available"}
              </p>
            </CollapsibleContent>
          </Collapsible>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <ClockIcon className="w-4 h-4" />
            <span>
              {getTimeDifference(data?.end?.dateTime!, data?.start?.dateTime!)}{" "}
              hour
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const UIStreamingMessage = ({ message }: { message?: string }) => {
  return (
    <Card className="w-full max-w-md bg-muted text-foreground">
      <CardContent className="space-y-4 py-4">
        <div className="flex items-center space-x-4">
          <CalendarSVG />
          <div>
            <Skeleton className="w-[150px] h-[18px] rounded-sm" />
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
              <CalendarIcon className="w-4 h-4 text-background" />
              <div className="flex gap-2">
                <Skeleton className="w-[70px] h-[16px] rounded-sm" />
                <Skeleton className="w-[70px] h-[16px] rounded-sm" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Skeleton className="w-[50px] h-[16px] rounded-sm" />
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <ClockIcon className="w-4 h-4 text-background" />
            <Skeleton className="w-[40px] h-[16px] rounded-sm" />
          </div>
        </div>
        <p className="text-sm"></p>
      </CardContent>
    </Card>
  );
};

const CalendarSVG = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkNhcGFfMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTUwIDE1MDsiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDE1MCAxNTAiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzFBNzNFODt9Cgkuc3Qxe2ZpbGw6I0VBNDMzNTt9Cgkuc3Qye2ZpbGw6IzQyODVGNDt9Cgkuc3Qze2ZpbGw6I0ZCQkMwNDt9Cgkuc3Q0e2ZpbGw6IzM0QTg1Mzt9Cgkuc3Q1e2ZpbGw6IzRDQUY1MDt9Cgkuc3Q2e2ZpbGw6IzFFODhFNTt9Cgkuc3Q3e2ZpbGw6I0U1MzkzNTt9Cgkuc3Q4e2ZpbGw6I0M2MjgyODt9Cgkuc3Q5e2ZpbGw6I0ZCQzAyRDt9Cgkuc3QxMHtmaWxsOiMxNTY1QzA7fQoJLnN0MTF7ZmlsbDojMkU3RDMyO30KCS5zdDEye2ZpbGw6I0Y2QjcwNDt9Cgkuc3QxM3tmaWxsOiNFNTQzMzU7fQoJLnN0MTR7ZmlsbDojNDI4MEVGO30KCS5zdDE1e2ZpbGw6IzM0QTM1Mzt9Cgkuc3QxNntjbGlwLXBhdGg6dXJsKCNTVkdJRF8yXyk7fQoJLnN0MTd7ZmlsbDojMTg4MDM4O30KCS5zdDE4e29wYWNpdHk6MC4yO2ZpbGw6I0ZGRkZGRjtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30KCS5zdDE5e29wYWNpdHk6MC4zO2ZpbGw6IzBENjUyRDtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30KCS5zdDIwe2NsaXAtcGF0aDp1cmwoI1NWR0lEXzRfKTt9Cgkuc3QyMXtvcGFjaXR5OjAuMztmaWxsOnVybCgjXzQ1X3NoYWRvd18xXyk7ZW5hYmxlLWJhY2tncm91bmQ6bmV3ICAgIDt9Cgkuc3QyMntjbGlwLXBhdGg6dXJsKCNTVkdJRF82Xyk7fQoJLnN0MjN7ZmlsbDojRkE3QjE3O30KCS5zdDI0e29wYWNpdHk6MC4zO2ZpbGw6IzE3NEVBNjtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30KCS5zdDI1e29wYWNpdHk6MC4zO2ZpbGw6I0E1MEUwRTtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30KCS5zdDI2e29wYWNpdHk6MC4zO2ZpbGw6I0UzNzQwMDtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30KCS5zdDI3e2ZpbGw6dXJsKCNGaW5pc2hfbWFza18xXyk7fQoJLnN0Mjh7ZmlsbDojRkZGRkZGO30KCS5zdDI5e2ZpbGw6IzBDOUQ1ODt9Cgkuc3QzMHtvcGFjaXR5OjAuMjtmaWxsOiMwMDRENDA7ZW5hYmxlLWJhY2tncm91bmQ6bmV3ICAgIDt9Cgkuc3QzMXtvcGFjaXR5OjAuMjtmaWxsOiMzRTI3MjM7ZW5hYmxlLWJhY2tncm91bmQ6bmV3ICAgIDt9Cgkuc3QzMntmaWxsOiNGRkMxMDc7fQoJLnN0MzN7b3BhY2l0eTowLjI7ZmlsbDojMUEyMzdFO2VuYWJsZS1iYWNrZ3JvdW5kOm5ldyAgICA7fQoJLnN0MzR7b3BhY2l0eTowLjI7fQoJLnN0MzV7ZmlsbDojMUEyMzdFO30KCS5zdDM2e2ZpbGw6dXJsKCNTVkdJRF83Xyk7fQoJLnN0Mzd7ZmlsbDojRkJCQzA1O30KCS5zdDM4e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzlfKTtmaWxsOiNFNTM5MzU7fQoJLnN0Mzl7Y2xpcC1wYXRoOnVybCgjU1ZHSURfMTFfKTtmaWxsOiNGQkMwMkQ7fQoJLnN0NDB7Y2xpcC1wYXRoOnVybCgjU1ZHSURfMTNfKTtmaWxsOiNFNTM5MzU7fQoJLnN0NDF7Y2xpcC1wYXRoOnVybCgjU1ZHSURfMTVfKTtmaWxsOiNGQkMwMkQ7fQo8L3N0eWxlPjxnPjxwb2x5Z29uIGNsYXNzPSJzdDYiIHBvaW50cz0iNzkuMiw2Ny4yIDgxLjgsNzAuOSA4NS44LDY4IDg1LjgsODkgOTAuMSw4OSA5MC4xLDYxLjQgODYuNSw2MS40ICAiLz48cGF0aCBjbGFzcz0ic3Q2IiBkPSJNNzIuMyw3NC40YzEuNi0xLjQsMi42LTMuNSwyLjYtNS43YzAtNC40LTMuOS04LTguNi04Yy00LDAtNy41LDIuNS04LjQsNi4ybDQuMiwxLjFjMC40LTEuNywyLjItMi45LDQuMi0yLjkgICBjMi40LDAsNC4zLDEuNiw0LjMsMy42YzAsMi0xLjksMy42LTQuMywzLjZoLTIuNXY0LjRoMi41YzIuNywwLDUsMS45LDUsNC4xYzAsMi4zLTIuMiw0LjEtNC45LDQuMWMtMi40LDAtNC41LTEuNS00LjgtMy42ICAgbC00LjIsMC43YzAuNyw0LjEsNC42LDcuMiw5LjEsNy4yYzUuMSwwLDkuMi0zLjgsOS4yLTguNUM3NS42LDc4LjIsNzQuMyw3NS45LDcyLjMsNzQuNHoiLz48cG9seWdvbiBjbGFzcz0ic3Q5IiBwb2ludHM9IjEwMC4yLDEyMC4zIDQ5LjgsMTIwLjMgNDkuOCwxMDAuMiAxMDAuMiwxMDAuMiAgIi8+PHBvbHlnb24gY2xhc3M9InN0NSIgcG9pbnRzPSIxMjAuMywxMDAuMiAxMjAuMyw0OS44IDEwMC4yLDQ5LjggMTAwLjIsMTAwLjIgICIvPjxwYXRoIGNsYXNzPSJzdDYiIGQ9Ik0xMDAuMiw0OS44VjI5LjdoLTYzYy00LjIsMC03LjYsMy40LTcuNiw3LjZ2NjNoMjAuMVY0OS44SDEwMC4yeiIvPjxwb2x5Z29uIGNsYXNzPSJzdDciIHBvaW50cz0iMTAwLjIsMTAwLjIgMTAwLjIsMTIwLjMgMTIwLjMsMTAwLjIgICIvPjxwYXRoIGNsYXNzPSJzdDEwIiBkPSJNMTEyLjgsMjkuN2gtMTIuNnYyMC4xaDIwLjFWMzcuMkMxMjAuMywzMywxMTcsMjkuNywxMTIuOCwyOS43eiIvPjxwYXRoIGNsYXNzPSJzdDEwIiBkPSJNMzcuMiwxMjAuM2gxMi42di0yMC4xSDI5Ljd2MTIuNkMyOS43LDExNywzMywxMjAuMywzNy4yLDEyMC4zeiIvPjwvZz48L3N2Zz4="
    alt="calendar"
    className="w-8 h-8 scale-125"
  />
);

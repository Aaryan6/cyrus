import { AIMessage } from "@/actions/chat.actions";

export type Chats = {
  id: string;
  userId: string;
  title: string;
  path: string;
  messages: AIMessage[];
  createdAt: Date;
  updatedAt: Date;
};

export type UserInfo = {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
  full_name: string;
  provider_token: string;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image: string;
  access_token?: string;
  id_token?: string;
  refresh_token?: string;
};

export type ScheduleMeetingOnCalendar = {
  summary: string;
  location?: string;
  description?: string;
  startTime: string;
  endTime: string;
  attendees?: { email: string }[];
};

export type AddEventOnCalendar = {
  summary: string;
  location?: string;
  description?: string;
  startTime: string;
  endTime: string;
};

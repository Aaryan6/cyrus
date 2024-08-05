import { AIMessage } from "@/actions/chat.actions";

export type Chats = {
  id: string;
  userId: string;
  payload: {
    id: string;
    title: string;
    user_id: string;
    createdAt: number;
    path: string;
    messages: AIMessage[];
  };
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

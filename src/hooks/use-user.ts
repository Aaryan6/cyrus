import { useSession } from "next-auth/react";

export const GetUser = () => {
  const session = useSession();
  return session.data?.user;
};

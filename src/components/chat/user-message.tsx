import { UserIcon } from "lucide-react";

type UserMessageProps = {
  message: string;
};
export const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  return (
    <div className="flex-1 relative w-full flex flex-col items-end">
      <div className="flex w-fit justify-start gap-x-2 mt-4 max-w-[80%]">
        <div
          className={
            "w-fit grid grid-cols-1 gap-2 text-sm leading-5  border py-2.5 px-4 rounded-xl rounded-se-none whitespace-pre-wrap"
          }
        >
          {message}
        </div>
        <div className="bg-background border w-8 h-8 rounded-full grid place-items-center">
          <UserIcon size={18} className="" />
        </div>
      </div>
    </div>
  );
};

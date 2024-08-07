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
            "w-fit grid grid-cols-1 gap-2 border-2 font-medium text-sm leading-5 border-muted-foreground/30 text-foreground bg-muted p-4 rounded-lg rounded-se-none whitespace-pre-wrap"
          }
        >
          {message}
        </div>
        <div className="bg-muted border border-muted-foreground/30 w-10 h-10 rounded-full grid place-items-center">
          <UserIcon />
        </div>
      </div>
    </div>
  );
};

import { Paperclip, Plus, SendIcon } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ChangeEvent, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, nanoid } from "@/lib/utils";

type Props = {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    { options }?: any
  ) => void;
  files: FileList | undefined;
  setFiles: React.Dispatch<React.SetStateAction<FileList | undefined>>;
  fileInputRef: React.RefObject<HTMLInputElement>;
};

export default function PromptBox({
  input,
  handleInputChange,
  handleSubmit,
  fileInputRef,
  files,
  setFiles,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();
  const newId = nanoid();

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e, {
        experimental_attachments: files,
      });
      setFiles(undefined);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, []);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    adjustHeight();
  };
  return (
    <div className="px-10 py-4 absolute bottom-0 inset-x-0 w-full max-w-4xl mx-auto">
      <form
        onSubmit={(event) => {
          handleSubmit(event, {
            experimental_attachments: files,
          });

          setFiles(undefined);

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
        className="relative bg-muted rounded-md"
      >
        <Textarea
          className="w-full resize-none max-h-44 rounded-md focus:outline-none focus:ring-2 focus:ring-muted dark:focus:ring-muted px-4 bg-transparent focus-visible:ring-offset-0"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => {
            handleInputChange(e);
            handleChange(e);
          }}
          spellCheck={true}
          onKeyDown={handleKeyDown}
          ref={textareaRef}
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
        />
        <div className="absolute bottom-0 rounded-lg -left-10 grid gap-1">
          <Link
            href={`/${pathname.split("/")[1]}/${newId}}`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "cursor-pointer w-8 h-8"
            )}
          >
            <Plus size={18} />
          </Link>
          <Label
            htmlFor="file"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "cursor-pointer w-8 h-8"
            )}
          >
            <Paperclip size={16} />
          </Label>
          <p>
            {files &&
              Array.from(files)
                .map(
                  (file) =>
                    file.name.substring(0, 12) +
                    "..." +
                    file.name.substring(file.name.length - 6)
                )
                .join(",")}
          </p>
        </div>
        <Input
          type="file"
          className="absolute top-5 left-5 w-fit hidden"
          onChange={(event) => {
            if (event.target.files) {
              setFiles(event.target.files);
            }
          }}
          id="file"
          multiple
          ref={fileInputRef}
        />
        <Button
          className="absolute top-1/2 right-3 -translate-y-1/2 hover:bg-background focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
          size="icon"
          type="submit"
          variant="ghost"
        >
          <SendIcon className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}

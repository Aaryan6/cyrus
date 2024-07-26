import { Paperclip, SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

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
        className="relative bg-muted rounded-md overflow-hidden h-[5rem]"
      >
        <Textarea
          className="w-full resize-none rounded-md h-full focus:outline-none focus:ring-2 focus:ring-muted dark:focus:ring-muted px-4 bg-transparent"
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
          spellCheck={true}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <Label htmlFor="file" className="cursor-pointer">
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
          className="absolute top-1/2 right-3 -translate-y-1/2 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
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

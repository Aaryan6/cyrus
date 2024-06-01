import ChatList from "@/components/chatbot/chat-list";
import PromptBox from "@/components/chatbot/prompt-box";

export default async function PersonalisePage() {
  return (
    <div className="flex-1 flex flex-col">
      <ChatList />
      <PromptBox />
    </div>
  );
}

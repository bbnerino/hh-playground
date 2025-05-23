import { Message } from "@/types/prompts/chat";
import React from "react";

const Chatting = ({ messages, isLoading }: { messages: Message[]; isLoading: boolean }) => {
  // Scroll 영역
  return (
    <div className="flex flex-col gap-2 items-start">
      {messages.map((message, index) => {
        return (
          <div key={index} className="w-full">
            <ChattingMessage role={message.role} message={message.content} />
          </div>
        );
      })}
      {isLoading && <div className="w-full h-10 bg-gray-100 rounded-md"></div>}
    </div>
  );
};

const ChattingMessage = ({
  role = "user",
  message = ""
}: {
  role?: "user" | "assistant" | "system";
  message?: string;
}) => {
  const mapRole = {
    user: "User",
    assistant: "Assistant",
    system: "System",
    function_call: "Function Call",
    function_call_output: "Function Call Output"
  };

  //    ``` ``` 영역 background 컬러 변경
  let processedMessage = message?.replace(/\n/g, "<br />");

  processedMessage = processedMessage?.replace(
    /```(.*?)```/g,
    `<div class="bg-gray-100 p-2 rounded-md"><p class="text-sm text-gray-500">Code</p>$1</div>`
  );

  processedMessage = processedMessage?.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

  return (
    <div className="flex flex-col border border-transparent p-2 gap-2 cursor-pointer hover:border hover:border-gray-300 hover:rounded-md max-w-xl break-words">
      <div className="text-sm text-gray-500">{mapRole[role]}</div>
      <div className="text-sm break-words whitespace-pre-line" dangerouslySetInnerHTML={{ __html: processedMessage }} />
    </div>
  );
};

export default Chatting;

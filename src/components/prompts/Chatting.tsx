import { Message } from "@/types/prompts/chat";
import React from "react";

const Chatting = ({ messages }: { messages: Message[] }) => {
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
    </div>
  );
};

const ChattingMessage = ({ role, message }: { role: "user" | "assistant" | "system"; message: string }) => {
  const mapRole = {
    user: "User",
    assistant: "Assistant",
    system: "System"
  };

  //    ``` ``` 영역 background 컬러 변경
  const processedMessage = message
    ?.replace(/\n/g, "<br />")
    ?.replace(
      /```(.*?)```/g,
      `<div class="bg-gray-100 p-2 rounded-md"><p class="text-sm text-gray-500">Code</p>$1</div>`
    );

  return (
    <div className="flex flex-col border border-transparent p-2 gap-2 cursor-pointer hover:border hover:border-gray-300 hover:rounded-md">
      <div className="text-sm text-gray-500">{mapRole[role]}</div>
      <div className="text-sm" dangerouslySetInnerHTML={{ __html: processedMessage }} />
    </div>
  );
};

export default Chatting;

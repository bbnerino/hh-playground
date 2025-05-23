"use client";
import Button from "@/components/Button";
import Chatting from "@/components/prompts/Chatting";
import PromptHeader from "@/components/prompts/Header";
import { Message } from "@/types/prompts/chat";
import { PromptModel } from "@/types/prompts/model";
import { PromptRequest } from "@/types/prompts/request";
import React, { useEffect, useRef, useState } from "react";
import Modal from "@/components/modal";
import ToolsModal from "./toolsModal";
import { Tool } from "@/types/prompts/tool";
import { getWeather } from "@/utils/prompts/tools/getWeather";

const PromptPage = () => {
  const models = [
    { name: "gpt-4.1", description: "text.format: text temp: 1.00 tokens: 2048 top_p: 1.00 store: true" },
    { name: "gpt-4.1-mini", description: "text.format: text temp: 1.00 tokens: 2048 top_p: 1.00 store: true" }
  ];
  const [model, setModel] = useState<PromptModel>(models[0]);

  const chat: Message[] = [
    {
      role: "user",
      content: "안녕 반가워 "
    },
    {
      id: "msg_682d8ca6d7248191b498ba5fb6f6f6080eda892f29d3cd35",
      role: "assistant",
      content: "안녕! 반가워요. 어떻게 도와드릴까요?"
    },
    {
      role: "user",
      content: "그러게 말이야"
    },
    {
      id: "msg_682d9010973481918005b08b5ad4461a0eda892f29d3cd35",
      role: "assistant",
      content: "그렇죠! 궁금한 거 있으면 언제든지 물어보세요. :)"
    },
    {
      role: "user",
      content:
        '지금 api 요청을 보면\n Message {\n  id: string;\n  role: "user" | "assistant";\n  content: {\n    type: "output_text";\n    text: string;\n  }[];\n}\n이렇게 생겻는데 왜 content가 리스트야?'
    },
    {
      id: "msg_682da8e641d4819182230db45e7f80260eda892f29d3cd35",
      role: "assistant",
      content: "강아지 그려줘123"
    }
  ];

  const [messages, setMessages] = useState<Message[]>([]);

  // 시스템 프롬프트
  const [systemPrompt, setSystemPrompt] = useState<string>("");

  // 온도
  const [temperature, setTemperature] = useState<number>(0.5);

  // 최대 출력 토큰
  const [maxOutputTokens, setMaxOutputTokens] = useState<number>(2048);

  // 입력
  const [input, setInput] = useState("");

  const scrollDown = async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    chatRef?.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth"
    });
  };

  const onSendMessage = async () => {
    const _messages = [...messages, new Message(input, "user")];
    setInput("");
    setMessages(_messages);

    const promptRequest = new PromptRequest({
      model: model.name,
      messages: _messages,
      systemPrompt
    });
    promptRequest.setTools(tools);
    scrollDown();

    const response = await promptRequest.request();
    scrollDown();
    setMessages(response.messages);
    console.log("🔵🐶🔵🔵🔵", response);
    if (response.toolCalled) {
      setRequestTrigger(true);
    }
  };

  const [requestTrigger, setRequestTrigger] = useState(false);
  useEffect(() => {
    if (requestTrigger) {
      setRequestTrigger(false);
      onSendMessage();
    }
  }, [requestTrigger]);

  const chatRef = useRef<HTMLDivElement>(null);

  const onPressEnter = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      setRequestTrigger(true);
    }
  };

  // tools
  const [tools, setTools] = useState<Tool[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleModalConfirm = (selectedTools: Tool[]) => {
    setIsOpenModal(false);
    setTools(selectedTools);
  };

  const handleRemoveTool = (toolName: string) => {
    setTools(tools.filter((tool) => tool.function.name !== toolName));
  };

  const onClickTool = async () => {
    const data = await getWeather({ lat: 37.5665, lon: 126.978 });
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-white">
      <PromptHeader />

      <main className="flex h-[calc(100vh-4rem)]">
        <PromptLayoutLeft>
          {/* MODEL */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Model</label>
            <div className="relative">
              <select
                className="w-50 px-3 py-2 bg-white border border-gray-300 rounded-md appearance-none pr-10 focus:outline-none focus:border-gray-400 cursor-pointer"
                value={model.name}
                onChange={(e) => setModel(models.find((m) => m.name === e.target.value) as PromptModel)}
              >
                {models.map((model) => (
                  <option key={model.name} value={model.name}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2">
              <code className="text-sm text-gray-600">{model.description}</code>
            </div>
          </div>

          {/* TOOLS */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tools</label>
            <div className="flex gap-2">
              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <div
                    key={tool.function.name}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                  >
                    <span>{tool.function.name}</span>
                    <button
                      onClick={() => handleRemoveTool(tool.function.name)}
                      className="cursor-pointer w-4 h-4 flex items-center justify-center hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <Button onClick={() => setIsOpenModal(true)}>+</Button>
              {/* <Button onClick={onClickTool}>+</Button> */}
            </div>
          </div>

          {/* SYSTEM MESSAGE */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">System message</label>
            <div>
              <textarea
                placeholder="Describe desired model behavior (tone, tool usage, response style)"
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-gray-400"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button className="w-full border-dashed">+ Add messages to describe task or add context</Button>
          </div>
        </PromptLayoutLeft>

        <PromptLayoutRight>
          {/* CHAT */}
          <div className="flex-1 p-6">
            <div className="h-full flex items-center justify-center text-gray-400">
              {messages.length === 0 ? (
                <div className="text-center">
                  <span className="text-2xl">💬</span>
                  <p className="mt-2">Your conversation will appear here</p>
                </div>
              ) : (
                <div className="chat-scroll w-full h-[calc(100vh-300px)] overflow-y-auto" ref={chatRef}>
                  <Chatting messages={messages} />
                </div>
              )}
            </div>
          </div>

          {/* INPUT */}
          <div className="border-t border-gray-300 p-6">
            <div className="relative">
              <textarea
                placeholder="Chat with your prompt..."
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-gray-400"
                value={input}
                onKeyDown={onPressEnter}
                onChange={(e) => setInput(e.target.value)}
              />
              <div
                className="absolute bottom-4 right-2 flex items-center rounded-full bg-green-300 w-10 h-10 justify-center hover:bg-green-400 cursor-pointer"
                onClick={() => setRequestTrigger(true)}
              >
                ⬆
              </div>
            </div>
          </div>
        </PromptLayoutRight>
      </main>

      <ToolsModal
        open={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onConfirm={handleModalConfirm}
        tools={tools}
      />
    </div>
  );
};

const PromptLayoutLeft = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-1/2 border-r border-gray-300 p-6">
      <div className="space-y-6">{children}</div>
    </div>
  );
};

const PromptLayoutRight = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-1/2 flex flex-col">{children}</div>;
};

export default PromptPage;

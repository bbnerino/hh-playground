"use client";
import Button from "@/components/Button";
import Chatting from "@/components/prompts/Chatting";
import PromptHeader from "@/components/prompts/Header";
import { Message } from "@/types/prompts/chat";
import { PromptModel } from "@/types/prompts/model";
import { PromptRequest } from "@/types/prompts/request";
import React, { useEffect, useRef, useState } from "react";
import ToolsModal from "./toolsModal";
import { Tool } from "@/types/prompts/tool";
import VectorStoreModal from "./vectorStoreModal";
import { VectorCollection } from "@/types/prompts/vectorStore";

const PromptPage = () => {
  const models = [
    { name: "gpt-4.1", description: "text.format: text temp: 1.00 tokens: 2048 top_p: 1.00 store: true" },
    { name: "gpt-4.1-mini", description: "text.format: text temp: 1.00 tokens: 2048 top_p: 1.00 store: true" }
  ];
  const [model, setModel] = useState<PromptModel>(models[0]);

  const [messages, setMessages] = useState<Message[]>([]);

  // 시스템 프롬프트
  const [systemPrompt, setSystemPrompt] = useState<string>("");

  // 입력

  const [isLoading, setIsLoading] = useState(false);

  const onSendMessage = async (submit: boolean = true) => {
    setIsLoading(true);
    let _messages = [...messages];
    if (submit) {
      _messages = [...messages, new Message(userPrompt, "user")];
      setMessages(_messages);
      setUserPrompt("");
    }

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
    if (response.toolCalled) {
      setRequestTrigger(true);
    }
    setIsLoading(false);
  };

  const [requestTrigger, setRequestTrigger] = useState(false);
  useEffect(() => {
    if (requestTrigger) {
      setRequestTrigger(false);
      onSendMessage(false);
    }
  }, [requestTrigger]);

  // CHATTING
  const [userPrompt, setUserPrompt] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const scrollDown = async () => {
    chatRef?.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth"
    });
  };

  const onPressEnter = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter") {
      e.preventDefault();
      onSendMessage(true);
    }
  };

  // TOOLS
  const [tools, setTools] = useState<Tool[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleModalConfirm = (selectedTools: Tool[]) => {
    setIsOpenModal(false);
    setTools(selectedTools);
  };

  const handleRemoveTool = (toolName: string) => {
    setTools(tools.filter((tool) => tool.function.name !== toolName));
  };

  // VECTOR STORE

  const [vectorCollections, setVectorCollections] = useState<VectorCollection[]>([]);

  const handleRemoveVectorCollection = (vectorCollectionName: string) => {
    setVectorCollections(
      vectorCollections.filter((vectorCollection) => vectorCollection.name !== vectorCollectionName)
    );
  };
  const handleModalConfirmVectorCollection = (selectedVectorCollections: VectorCollection[]) => {
    setIsOpenModal(false);
    setVectorCollections(selectedVectorCollections);
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
              <ToolsModal
                open={isOpenModal}
                onClose={() => setIsOpenModal(false)}
                onConfirm={handleModalConfirm}
                tools={tools}
              />
            </div>
          </div>

          {/* VECTOR STORE */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Vector Store</label>
            <div className="flex gap-2">
              <div className="flex flex-wrap gap-2">
                {vectorCollections.map((vectorCollection) => (
                  <div
                    key={vectorCollection.name}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                  >
                    <span>{vectorCollection.name}</span>
                    <button
                      onClick={() => handleRemoveVectorCollection(vectorCollection.name)}
                      className="cursor-pointer w-4 h-4 flex items-center justify-center hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <Button onClick={() => setIsOpenModal(true)}>+</Button>
              <VectorStoreModal
                open={isOpenModal}
                onClose={() => setIsOpenModal(false)}
                onConfirm={handleModalConfirmVectorCollection}
                vectorCollections={vectorCollections}
              />
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
                  <Chatting messages={messages} isLoading={isLoading} />
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
                value={userPrompt}
                onKeyDown={onPressEnter}
                onChange={(e) => setUserPrompt(e.target.value)}
              />
              <div
                className="absolute bottom-4 right-2 flex items-center rounded-full bg-green-300 w-10 h-10 justify-center hover:bg-green-400 cursor-pointer"
                onClick={() => onSendMessage(true)}
              >
                ⬆
              </div>
            </div>
          </div>
        </PromptLayoutRight>
      </main>
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

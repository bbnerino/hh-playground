"use client";
import Button from "@/components/Button";
import Chatting from "@/app/prompts/components/Chatting";
import PromptHeader from "@/app/prompts/components/Header";
import { Message } from "@/types/prompts/chat";
import { PromptModel } from "@/types/prompts/model";
import { PromptRequest } from "@/types/prompts/request";
import React, { useEffect, useRef, useState } from "react";
import ToolsModal from "./components/modal/toolsModal";
import { Tool } from "@/types/prompts/tool";
import VectorStoreModal from "./components/modal/vectorStoreModal";
import { VectorCollection } from "@/types/prompts/vectorStore";
import SelectModel from "./components/SelectModel";
import ItemButton from "./components/ItemButton";

const PromptPage = () => {
  // MODEL
  const [model, setModel] = useState<PromptModel>(new PromptModel());

  const [messages, setMessages] = useState<Message[]>([]);

  // 시스템 프롬프트
  const [systemPrompt, setSystemPrompt] = useState<string>("");

  // 입력

  const [isLoading, setIsLoading] = useState(false);

  const [requestTrigger, setRequestTrigger] = useState(false);
  useEffect(() => {
    if (requestTrigger) {
      setRequestTrigger(false);
      onSendMessage(false);
    }
  }, [requestTrigger]);

  // CHATTING
  const [userPrompt, setUserPrompt] = useState("");

  const onPressEnter = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter" && !e.shiftKey) {
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
  const [vectorCollectionsOpen, setVectorCollectionsOpen] = useState(false);

  const handleRemoveVectorCollection = (vectorCollectionName: string) => {
    setVectorCollections(
      vectorCollections.filter((vectorCollection) => vectorCollection.name !== vectorCollectionName)
    );
  };
  const handleModalConfirmVectorCollection = (selectedVectorCollections: VectorCollection[]) => {
    setVectorCollectionsOpen(false);
    setVectorCollections(selectedVectorCollections);
  };

  // 🟢 MAIN FUNCTION
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
    promptRequest.setVectorCollections(vectorCollections);

    const response = await promptRequest.request();
    setMessages(response.messages);
    if (response.toolCalled) {
      setRequestTrigger(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <PromptHeader />

      <main className="flex h-[calc(100vh-4rem)]">
        <div className="w-1/2 border-r border-gray-300 p-6 flex flex-col gap-6">
          {/* MODEL */}
          <SelectModel model={model} setModel={setModel} />

          {/* TOOLS */}
          <div className="space-y-2">
            <label className="block text-md font-bold text-gray-700">Tools</label>
            <div className="flex gap-2">
              <div className="flex flex-wrap gap-2">
                {tools.map((tool, index) => (
                  <ItemButton key={index} name={tool.function.name} handleRemoveTool={handleRemoveTool} />
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
            <label className="block text-md font-bold text-gray-700">Vector Store</label>
            <div className="flex gap-2">
              <div className="flex flex-wrap gap-2">
                {vectorCollections.map((vectorCollection, index) => (
                  <ItemButton
                    key={index}
                    name={vectorCollection.name}
                    handleRemoveTool={handleRemoveVectorCollection}
                  />
                ))}
              </div>
              <Button onClick={() => setVectorCollectionsOpen(true)}>+</Button>
              <VectorStoreModal
                open={vectorCollectionsOpen}
                onClose={() => setVectorCollectionsOpen(false)}
                onConfirm={handleModalConfirmVectorCollection}
                vectorCollections={vectorCollections}
              />
            </div>
          </div>

          {/* SYSTEM MESSAGE */}
          <div className="space-y-2">
            <label className="block text-md font-bold text-gray-700">System message</label>
            <div>
              <textarea
                placeholder="Describe desired model behavior (tone, tool usage, response style)"
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-gray-400"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
              />
            </div>
          </div>

          <Button className="w-full border-dashed">+ Add messages to describe task or add context</Button>
        </div>

        <div className="w-1/2 flex flex-col">
          {/* CHAT */}
          <div className="flex-1 p-6">
            <div className="h-full flex items-center justify-center text-gray-400">
              {messages.length === 0 ? (
                <div className="text-center">
                  <span className="text-2xl">💬</span>
                  <p className="mt-2">Your conversation will appear here</p>
                </div>
              ) : (
                <Chatting messages={messages} isLoading={isLoading} />
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
        </div>
      </main>
    </div>
  );
};

export default PromptPage;

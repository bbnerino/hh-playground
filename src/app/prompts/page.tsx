"use client";
import Button from "@/components/Button";
import Chatting from "@/components/prompts/Chatting";
import PromptHeader from "@/components/prompts/Header";
import { Message } from "@/types/prompts/chat";
import { PromptModel } from "@/types/prompts/model";
import { PromptRequest } from "@/types/prompts/request";
import React, { useState } from "react";

const PromptPage = () => {
  const models = [
    { name: "gpt-4.1-mini", description: "text.format: text temp: 1.00 tokens: 2048 top_p: 1.00 store: true" },
    { name: "gpt-4.1", description: "text.format: text temp: 1.00 tokens: 2048 top_p: 1.00 store: true" }
  ];
  const [model, setModel] = useState<PromptModel>(models[0]);

  const chat: Message[] = [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: "안녕 반가워 "
        }
      ]
    },
    {
      id: "msg_682d8ca6d7248191b498ba5fb6f6f6080eda892f29d3cd35",
      role: "assistant",
      content: [
        {
          type: "output_text",
          text: "안녕! 반가워요. 어떻게 도와드릴까요?"
        }
      ]
    },
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: "그러게 말이야"
        }
      ]
    },
    {
      id: "msg_682d9010973481918005b08b5ad4461a0eda892f29d3cd35",
      role: "assistant",
      content: [
        {
          type: "output_text",
          text: "그렇죠! 궁금한 거 있으면 언제든지 물어보세요. :)"
        }
      ]
    },
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: '지금 api 요청을 보면\n Message {\n  id: string;\n  role: "user" | "assistant";\n  content: {\n    type: "output_text";\n    text: string;\n  }[];\n}\n이렇게 생겻는데 왜 content가 리스트야?'
        }
      ]
    },
    {
      id: "msg_682da8e641d4819182230db45e7f80260eda892f29d3cd35",
      role: "assistant",
      content: [
        {
          type: "output_text",
          text: "좋은 질문이에요!\n\n`content`가 리스트(배열) 형태인 이유는, 한 메시지 내에서 여러 개의 텍스트 조각(text chunks)을 순서대로 포함할 수 있도록 설계되었기 때문입니다.\n\n예를 들어, 메시지 하나가 단순한 한 문장 텍스트 외에도 여러 문단이나 구분된 여러 텍스트 조각으로 구성될 수 있겠죠. 이 경우, 각 텍스트 조각을 배열의 한 원소로 관리하면,\n\n- 순서가 보장되고\n- 나중에 각 텍스트 덩어리별로 다르게 처리하거나 렌더링할 수 있습니다.\n\n또한, 확장성을 고려해서 나중에 텍스트뿐만 아니라 이미지, 링크 등 다양한 형태의 콘텐츠 타입을 배열에 섞어서 넣기도 수월합니다.\n\n요약하자면,  \n`content`가 리스트인 이유는 한 메시지 안에 여러 개의 콘텐츠 단위(텍스트 덩어리)를 순서대로 담기 위함이며, 나중에 다양한 콘텐츠 타입도 포함할 수 있도록 확장 가능하게 설계한 구조입니다.\n\n필요하면 예시도 더 드릴 수 있어요!"
        }
      ]
    },
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: "강아지 그려줘"
        }
      ]
    },
    {
      id: "msg_682da91e139c8191ba80f8ecf1c1ffbf0eda892f29d3cd35",
      role: "assistant",
      content: [
        {
          type: "output_text",
          text: "제가 그림을 직접 그릴 순 없지만, 강아지를 간단하게 텍스트로 표현해볼게요!\n\n```\n / \\__\n(    @\\___\n /         O\n/   (_____/\n/_____/ U\n```\n\n귀여운 강아지 이모티콘입니다!  \n혹시 강아지 사진이나 이미지가 필요하면 알려주세요. 온라인에서 참고할 만한 링크도 찾아드릴 수 있습니다!"
        }
      ]
    }
  ];

  const [messages, setMessages] = useState<Message[]>([]);

  // 시스템 프롬프트
  const [systemPrompt, setSystemPrompt] = useState<string>("");

  // 툴
  const [tools, setTools] = useState<string[]>([]);

  // 온도
  const [temperature, setTemperature] = useState<number>(0.5);

  // 최대 출력 토큰
  const [maxOutputTokens, setMaxOutputTokens] = useState<number>(2048);

  // 입력
  const [input, setInput] = useState<string>("");

  const onSendMessage = async () => {
    const promptRequest = new PromptRequest({
      model: model.name,
      input: messages,
      userPrompt: input
    });

    // promptRequest.setTool()

    const newMessage = await promptRequest.request();
    setMessages([...messages, newMessage]);
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
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md appearance-none pr-10 focus:outline-none focus:border-gray-400"
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
              <input
                type="text"
                placeholder="Create..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
              />
              <Button>+</Button>
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
                <div className="w-full">
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
                onChange={(e) => setInput(e.target.value)}
              />
              <div
                className="absolute bottom-4 right-2 flex items-center rounded-full bg-green-300 w-10 h-10 justify-center hover:bg-green-400 cursor-pointer"
                onClick={onSendMessage}
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

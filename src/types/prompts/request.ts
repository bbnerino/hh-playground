import { Message } from "./chat";

export class PromptRequest {
  model: string = "";
  input: Message[] = [];

  text = { format: { type: "text" } } as const;

  reasoning: { [key: string]: string } = {};

  tools: string[] = [];
  temperature: number = 1;
  max_output_tokens: number = 2048;
  top_p: number = 1;
  store: boolean = true;

  constructor({
    model,
    input,
    userPrompt,
    systemPrompt
  }: {
    model: string;
    input: Message[];
    userPrompt: string;
    systemPrompt?: string;
  }) {
    this.model = model;
    this.input = input;
    if (systemPrompt) this.setSystemPrompt(systemPrompt);
    this.setUserPrompt(userPrompt);
  }

  // 시스템 메시지
  private setSystemPrompt(systemPrompt: string) {
    this.input.unshift({ role: "system", content: [{ type: "text", text: systemPrompt }] });
  }
  // 유저 메시지
  private setUserPrompt(userPrompt: string) {
    this.input.push({ role: "user", content: [{ type: "text", text: userPrompt }] });
  }

  // tool 추가
  private setTool(tool: string) {
    this.tools.push(tool);
  }

  public async request(): Promise<Message> {
    // LLM 호출 (API Route 활용)
    const res = await fetch("/api/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.model,
        messages: this.input,
        // text: this.text,
        // tools: this.tools,
        // reasoning: this.reasoning,
        // temperature: this.temperature,
        // max_output_tokens: this.max_output_tokens,
        // top_p: this.top_p,
        // store: this.store
      })
    });
    const data = await res.json();

    const newData = {
      role: "assistant",
      content: [
        {
          type: "output_text",
          text: data.result
        }
      ]
    } as Message;
    return newData;
  }
}

const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.2
  });

// { role: "system", content: systemPrompt },
// {
//   role: "user",
//   content: context
//     ? `\n다음은 사용자가 업로드한 .엑셀 파일에서 추출된 내용입니다.\nLLM은 이 정보를 기반으로 답변합니다.\n\n[참고 정보]:\n${context}`
//     : ""
// }

import { Message } from "./chat";

export class PromptRequest {
  model: string = "";
  messages: Message[] = [];

  tools: string[] = [];
  temperature: number = 1;
  top_p: number = 1;
  store: boolean = true;

  constructor({
    model,
    messages,
    userPrompt,
    systemPrompt
  }: {
    model: string;
    messages: Message[];
    userPrompt: string;
    systemPrompt?: string;
  }) {
    this.model = model;
    this.messages = messages;
    if (systemPrompt) this.setSystemPrompt(systemPrompt);
    this.setUserPrompt(userPrompt);
  }

  // 시스템 메시지
  private setSystemPrompt(systemPrompt: string) {
    this.messages.unshift({ role: "system", content: systemPrompt });
  }
  // 유저 메시지
  private setUserPrompt(userPrompt: string) {
    this.messages.push({ role: "user", content: userPrompt });
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
        messages: this.messages,
        tools: this.tools,
        temperature: this.temperature,
        top_p: this.top_p,
        store: this.store
      })
    });

    if (res.status === 200) {
      const data = await res.json();

      return {
        role: "assistant",
        content: data.result
      };
    }
    const message = await res.json();
    return {
      role: "assistant",
      content: message.error || "Failed to request"
    };
  }
}

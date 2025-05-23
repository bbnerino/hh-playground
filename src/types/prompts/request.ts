import { Message } from "./chat";

export class PromptRequest {
  model: string = "";
  messages: Message[] = [];

  tools: string[] = [];
  temperature: number = 1;
  top_p: number = 1;
  store: boolean = true;

  systemPrompt?: string = "";

  constructor({ model, messages, systemPrompt }: { model: string; messages: Message[]; systemPrompt?: string }) {
    this.model = model;
    this.messages = messages;
    this.systemPrompt = systemPrompt;
  }

  // tool 추가
  private setTool(tool: string) {
    this.tools.push(tool);
  }

  public async request(): Promise<Message> {
    // LLM 호출 (API Route 활용)

    const _messages = this.systemPrompt ? [new Message(this.systemPrompt, "system"), ...this.messages] : this.messages;

    const res = await fetch("/api/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.model,
        messages: _messages,
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

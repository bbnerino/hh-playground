import { toolExecute } from "@/utils/prompts/tools";
import { Message } from "./chat";
import { Tool, ToolCall } from "./tool";

export class PromptRequest {
  model: string = "";
  messages: Message[] = [];

  tools: Tool[] = [];
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
  setTools(tools: Tool[]) {
    this.tools = tools;
  }

  public async request(): Promise<{ toolCall: boolean; messages: Message[] }> {
    // LLM 호출 (API Route 활용)

    this.setSystemPrompt();
    const requestData = {
      model: this.model,
      messages: this.messages,
      tools: this.tools,
      temperature: this.temperature,
      top_p: this.top_p,
      store: this.store,
      tool_choice: "auto"
    };

    const res = await this.fetch(requestData);

    if (res.status === 200) {
      const data = await res.json();
      const messages = [...this.messages];

      messages.push({
        role: "assistant",
        content: data.result || "Failed to request"
      });

      return { toolCall: false, messages };
    }

    if (res.status === 202) {
      const data = await res.json();

      const toolCalls = (data.tool_calls as ToolCall[]) || [];

      const messages = [...this.messages];

      for (const toolCall of toolCalls) {
        try {
          const tool = toolExecute[toolCall.function.name as keyof typeof toolExecute];
          const args = JSON.parse(toolCall.function.arguments || "{}");
          messages.push(
            new Message(
              JSON.stringify({
                type: "function_call",
                call_id: toolCall.id,
                name: toolCall.function.name,
                arguments: JSON.stringify(args)
              }),
              "assistant"
            )
          );

          const result = await tool(args);

          messages.push(
            new Message(
              JSON.stringify({
                type: "function_call_output",
                call_id: toolCall.id,
                output: JSON.stringify(result)
              }),
              "user"
            )
          );
        } catch (error) {
          console.error(error);
          messages.push(
            new Message(
              JSON.stringify({
                type: "function_call_output",
                call_id: toolCall.id,
                output: "Failed to request"
              }),
              "user"
            )
          );
        }
      }

      return { toolCall: true, messages };
    }

    const message = await res.json();
    return {
      toolCall: false,
      messages: [
        ...this.messages,
        {
          role: "assistant",
          content: message.error || "Failed to request"
        }
      ]
    };
  }

  private setSystemPrompt() {
    if (!this.systemPrompt) {
      // 시스템 프롬프트가 없는데, 첫번째에 있는 경우 -> 없앤다.
      if (this.messages[0].role === "system") {
        this.messages = this.messages.slice(1);
      }
      return;
    }

    // message의 첫 번째 메시지가 system 메시지인 경우, systemPrompt를 변경
    if (this.messages[0].role === "system") {
      this.messages[0].content = this.systemPrompt;
    }

    // message의 첫 번째 메시지가 system 메시지가 아닐 경우 시스템 프롬프트를 추가
    if (this.messages[0].role !== "system") {
      const systemMessage = new Message(this.systemPrompt, "system");
      this.messages.unshift(systemMessage);
    }
  }

  private async fetch(data: any) {
    const res = await fetch("/api/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    return res;
  }
}

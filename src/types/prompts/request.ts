import { toolExecute } from "@/utils/tools";
import { Message } from "./chat";
import { Tool, ToolCall } from "./tool";
import { VectorCollection } from "./vectorStore";
import { searchDocumentsFunctionData } from "@/utils/tools/searchDocuments";
import { reactPrompt } from "@/utils/prompts/reactPrompt";

export class PromptRequest {
  model: string = "";
  messages: Message[] = [];

  tools: Tool[] = [];
  temperature: number = 1;
  systemPrompt: string = "";
  isReActMode: boolean = false;

  constructor({
    model,
    messages,
    systemPrompt,
    isReActMode
  }: {
    model: string;
    messages: Message[];
    systemPrompt: string;
    isReActMode: boolean;
  }) {
    this.model = model;
    this.messages = messages;
    this.systemPrompt = systemPrompt;
    this.isReActMode = isReActMode;
    // this.setSystemPrompt(systemPrompt);
  }

  // tool 추가
  setTools(tools: Tool[]) {
    this.tools = [...tools];
  }
  setVectorCollections(vectorCollections: VectorCollection[]) {
    if (vectorCollections.length > 0) {
      this.tools.push(searchDocumentsFunctionData(vectorCollections));
    }
  }

  setReActMode() {
    // system prompt 에 다음 문구 추가
    if (this.isReActMode) {
      this.systemPrompt = reactPrompt + "\n\n" + this.systemPrompt;
    }
  }

  private setSystemPrompt() {
    // messages 의 0 번은 무조건 system 메시지
    this.setReActMode();

    if (this.messages[0].role === "system") {
      this.messages[0].content = this.systemPrompt;
    } else {
      const systemMessage = new Message(this.systemPrompt, "system");
      this.messages.unshift(systemMessage);
    }
  }

  public async request(): Promise<{ toolCalled: boolean; messages: Message[] }> {
    // LLM 호출 (API Route 활용)

    this.setSystemPrompt();

    const requestData = {
      model: this.model,
      messages: this.messages,
      tools: this.tools,
      temperature: this.temperature,
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

      return { toolCalled: false, messages };
    }

    if (res.status === 202) {
      const data = await res.json();

      const toolCalls = (data.tool_calls as ToolCall[]) || [];

      const messages = [...this.messages];

      for (const toolCall of toolCalls) {
        messages.push(
          new Message(
            JSON.stringify({
              type: "function_call",
              call_id: toolCall.id,
              name: toolCall.function.name,
              arguments: toolCall.function.arguments
            }),
            "assistant"
          )
        );
        try {
          const { name, arguments: args } = toolCall.function;
          const tool = toolExecute[name];
          const parsedArgs = JSON.parse(args);

          const result = await tool(parsedArgs);

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

      return { toolCalled: true, messages };
    }

    const message = await res.json();
    return {
      toolCalled: false,
      messages: [
        ...this.messages,
        {
          role: "assistant",
          content: message.error || "Failed to request"
        }
      ]
    };
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

export class Message {
  id?: string;
  role: "user" | "assistant" | "system";
  content?: string;

  // type?: "function_call" | "function_call_output";
  // call_id?: string;
  // output?: string;
  // name?: string;
  // arguments?: string;

  constructor(content: string, role: "user" | "assistant" | "system" = "user") {
    this.role = role;
    this.content = content;
  }
}

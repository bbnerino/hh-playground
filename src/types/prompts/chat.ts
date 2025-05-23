export class Message {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;

  constructor(content: string, role: "user" | "assistant" | "system" = "user") {
    this.role = role;
    this.content = content;
  }
}

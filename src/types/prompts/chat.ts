export interface Message {
  id?: string;
  role: "user" | "assistant" | "system";
  content: {
    type: "output_text" | "input_text" | "output_image" | "input_image" | "text";
    text: string;
  }[];
}

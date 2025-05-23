export interface Tool {
  type: string;
  function: {
    name: string;
    description: string;
    parameters: any;
  };
}

export interface ToolCall {
  id: string;
  call_id: string;
  type: string;
  function: {
    name: string;
    arguments: string;
  };
}

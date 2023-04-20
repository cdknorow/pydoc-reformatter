export interface Message {
  content: string;
  role: string;
}

export interface ChatStartPayload {
  messages: Message[];
  model: string;
  temperature: number;
}

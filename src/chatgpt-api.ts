import axios from "axios";
import * as vscode from "vscode";
import { ChatStartPayload } from "./interfaces.js";

export default class ChatGPTApi {
  apiKey: string | null;
  backendApiBaseUrl: string;

  constructor() {
    this.apiKey = null;
    this.backendApiBaseUrl = "https://api.openai.com/v1/chat";
  }

  getAPIKey() {
    if (!this.apiKey) {
      this.apiKey =
        vscode.workspace.getConfiguration("pydocReformat").chatGPTAPIKey;
    }

    return this.apiKey;
  }

  async getCompletion(message: string) {
    const apiKey = this.getAPIKey();
    const body: ChatStartPayload = {
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    const url = "https://api.openai.com/v1/chat/completions";

    const res = await axios.post(url, body, { headers });

    return res.data;
  }
}

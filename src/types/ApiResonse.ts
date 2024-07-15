import { Message } from "@/model/User";

export interface APIResponse {
  sucess: boolean;
  message: string;
  isaAcceptingMessage?: boolean;
  messages?: Array<Message>;
}

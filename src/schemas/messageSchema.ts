import { max } from "moment";
import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "content must be aleest 10 character" })
    .max(300, { message: "content must be no longer than 300 characters" }),
});

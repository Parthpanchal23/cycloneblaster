import { resend } from "@/lib/resend";
import { VerificationEmailTemplate } from "../../emails/verificationEmail";
import { APIResponse } from "@/types/ApiResonse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<APIResponse> {
  try {
    // const { data, error } = await resend.emails.send({
    //   from: "onboarding@resend.dev",
    //   to: "delivered@resend.dev",
    //   subject: "Mystry message Verification code",
    //   react: VerificationEmailTemplate({ username, otp: verifyCode }),
    // });
    return { sucess: true, message: "verification email send sucessfully" };
  } catch (emilError) {
    console.log("error sending verification emial", emilError);
    return { sucess: false, message: "failed Ro send verification email" };
  }
}

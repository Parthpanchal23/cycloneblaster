import dbconnect from "@/lib/dbconect";
import UserModel from "@/model/User";
import { signupSchema, usernameValidation } from "@/schemas/signUpSchema";
import z from "zod";

export async function POST(request: Request) {
  await dbconnect();
  try {
    const { username, code } = await request.json();

    const decodedUserName = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUserName });

    if (!user) {
      return Response.json(
        {
          sucess: false,
          message: "User not Found",
        },
        {
          status: 500,
        }
      );
    }
    const isCodeVelid = user.verifyCode === code;
    const iscodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isCodeVelid && iscodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          sucess: true,
          message: "Account verified Sucessfully",
        },
        {
          status: 200,
        }
      );
    } else if (iscodeNotExpired) {
      return Response.json(
        {
          sucess: false,
          message: "Verification code is expired ,please sign  in",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          sucess: false,
          message: "Incorrect verification code",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error("Error  Verifiying user", error);
    return Response.json(
      {
        sucess: false,
        message: "Error Verifiying user",
      },
      {
        status: 500,
      }
    );
  }
}

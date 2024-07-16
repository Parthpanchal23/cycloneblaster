import dbconnect from "@/lib/dbconect";
import UserModel from "@/model/User";
import { signupSchema, usernameValidation } from "@/schemas/signUpSchema";
import z from "zod";

const UsernameQuerySchema = z.object({ username: usernameValidation });
export async function GET(request: Request) {
  if (request.method !== "GET") {
    return Response.json(
      {
        success: false,
        message: "Methos not allowed",
      },
      {
        status: 405,
      }
    );
  }
  await dbconnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryparams = { username: searchParams.get("username") };
    // validation with zod
    const result = UsernameQuerySchema.safeParse(queryparams);
    console.log("UsernameQuerySchema REsult ", result);
    if (!result.success) {
      const userNameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            userNameError?.length > 0
              ? userNameError.join(",")
              : "Invalid qury Parameter",
        },
        {
          status: 400,
        }
      );
    }
    const { username } = result?.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isverified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: true,
          message: "Username is unique",
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error("Errro at checking username", error);
    return Response.json(
      {
        sucess: false,
        message: "Error checking username",
      },
      {
        status: 500,
      }
    );
  }
}

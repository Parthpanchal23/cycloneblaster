import dbconnect from "@/lib/dbconect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbconnect();
  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          sucess: false,
          message: "NOt Found User",
        },
        {
          status: 404,
        }
      );
    }
    // user accepring message
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          sucess: false,
          message: "User is not accepting messages",
        },
        {
          status: 403,
        }
      );
    }

    const newMessage = { content, createdAt: new Date() };

    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json(
      {
        sucess: true,
        message: "Message send sucessfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        sucess: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}

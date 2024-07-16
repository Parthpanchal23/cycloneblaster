import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbconnect from "@/lib/dbconect";
import UserModel from "@/model/User";
import { User } from "next-auth";
export async function POST(request: Request) {
  await dbconnect();
  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        sucess: false,
        message: "NOt authentoicated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();
  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );
    if (!updateUser) {
      return Response.json(
        {
          sucess: false,
          message: "faild to update user status to accept messages",
        },
        {
          status: 401,
        }
      );
    }
    return Response.json(
      {
        sucess: true,
        message: "Mesasge Acceptance sttaus updated sucessfully",
        updateUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        sucess: false,
        message: "failed to  update user status to accept messages",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: Request) {
  await dbconnect();
  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        sucess: false,
        message: "NOt authentoicated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          sucess: false,
          message: "User Not Found",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        sucess: true,
        message: "User Found",
        isAccceptingMEssaged: foundUser.isAcceptingMessage,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        sucess: false,
        message: "Error in getting message acceptance error",
      },
      {
        status: 500,
      }
    );
  }
}

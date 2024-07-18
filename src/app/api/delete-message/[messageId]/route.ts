import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbconnect from "@/lib/dbconect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function DELETE(
  requesr: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
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
  try {
    const updateResult = await UserModel.updateOne(
      {
        _id: user._id,
      },
      {
        $pull: { messages: { _id: messageId } },
      }
    );
    if (updateResult.modifiedCount == 0) {
      return Response.json(
        {
          sucess: false,
          message: "Message not found or already seleted",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        sucess: true,
        message: "Message Deleted",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error is delete message ", error);

    return Response.json(
      {
        sucess: false,
        message: "Error deleting Message",
      },
      {
        status: 500,
      }
    );
  }
}

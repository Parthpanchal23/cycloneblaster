import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbconnect from "@/lib/dbconect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST (request:Request){

    await dbconnect()
    try {
        const {username,email,password}=await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({username, isVerified:true});

        if(existingUserVerifiedByUsername){
        return Response.json({
        sucess:false,message:"User Name alreadu taken"
        },{status:400})  
        }

        const existingUserByEmail =await UserModel.findOne({email});
        const  verifyCode = Math.floor(10000 +Math.random()*90000).toString();
     if(existingUserByEmail)
        {
            if(existingUserByEmail.isVerified)
                {
                    return Response.json({
                        sucess:false,
                        message:"USer already exist with this email",
                    },{status:400})  
                }
                else{
                    const hasedPassword = await bcrypt.hash(password,10)
                    existingUserByEmail.password == hasedPassword
                    existingUserByEmail.verifyCode = verifyCode;
                    existingUserByEmail.verifyCodeExpiry =new Date(Date.now()+3600000);

                    await existingUserByEmail.save();
                }
        }
        else{
           const hasedPassword = await bcrypt.hash(password,10);
           const expiryDate =new Date();
           expiryDate.setHours(expiryDate.getHours()+1);

           const newUser= new UserModel({
            username,
            email,
            password:hasedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            isVerified: false,
            isAcceptingMessage: true,
            messages:[]
           })
           await newUser.save()

        }
        // send verification email
        const emailResponse =await sendVerificationEmail({ email,
            username,
            verifyCode});

            if(emailResponse){
                return Response.json({
                    sucess:false,
                    message:emailResponse.message
                },{status:500})
            }
            return Response.json({
                sucess:true,
                message:"User Registered Sucessfully Please verify ypur email"
            },{status:500})
    } catch (error) {
    console.error('error registerring user',error);
    return Response.json({
        sucess:false,
        message:"Error registering user"
    },{
        status:500
    })
    }
}
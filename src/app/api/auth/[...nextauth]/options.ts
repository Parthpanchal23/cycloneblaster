import {NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcreypt from "bcryptjs"
import dbconnect from "@/lib/dbconect"
import UserModel from "@/model/User"

export const authOptions:NextAuthOptions = {
    providers:[
        CredentialsProvider({
            // id:"credentials",
            name:"Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
              },
            async authorize(credentials:any) :Promise<any>{
                await dbconnect()
                try {
                  const user=  await UserModel.findOne({$or:[
                        {email:credentials.identifier.email},
                        {password:credentials.identifier.password}]})
                    if(!user){
                        throw new Error('No User Found with this error');
                    }

                    if(!user.isVerified){
                        throw new Error('Please verify your account first before Login');
                     }

                    const isPasswordCorrect = await bcreypt.compare(credentials.password,user.password)
                    if(!isPasswordCorrect){
                        throw new Error('Incorrect Pasword'); 
                    }
                    else{
                        return user

                    }
                } catch (err:any) {
                    throw new Error ()
                }
            }
        })
    ],
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:"jwt"
    },
    callbacks:{ 
        async jwt({ token, user }) {
            if(user){
                token._id =user._id?.toString()
            }

            return token
        }},
        async session({ session,  token }) {
        return session
        }
    secret:process.env.NEXTAUTH_SECRET
}
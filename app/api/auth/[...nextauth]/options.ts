import prisma from "@/lib/db"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"



export const authOptions:NextAuthOptions ={
    pages:{
signIn:'/'
    },
   session:{
    strategy:'jwt'
   },
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
          const email = credentials?.email
          const password = credentials?.password
console.log(email,password)
        
          if(!email || !password) throw new Error('Enter uemail and password')
          
  
          const company = await prisma.company.findFirst({
            where:{
                email:email,
                password:password,
                isActive:true
                
            },
         
          })

        
          if(company){
            return {email:company.email,id:company.id,name:'Company'};
          }else{
            const entity = await prisma.entity.findFirst({
              where:{
                  email:email,
                  password:password,
                  isActive:true
                  
              },
           
            })
            if(entity) return {email:entity.email,id:entity.id,name:'Entity'}

          }

          return null
  
       
        
        }
      })
      ]
}
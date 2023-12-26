import prisma from "@/lib/db"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { comparePasswords } from "../../(helpers)/bcrypt"



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
          console.log(password)
  
          const company = await prisma.company.findFirst({
            where:{
                email:email,
              
                isActive:true
                
            },
         
          })

        
          if(company){

            const isMatch = await comparePasswords(password,company.password)
            if(isMatch){
              return {email:company.email,id:company.id,name:'Company'};
            }else {
              return null
            }
           
          }else{
            const entity = await prisma.entity.findFirst({
              where:{
                  email:email,
                
                  isActive:true
                  
              },
           
            })
            if(entity) {
              
              const isMatch = await comparePasswords(password,entity.password)

              if(isMatch){
                return {email:entity.email,id:entity.id,name:'Entity'}}
              }else{
                return null
              }
          

          }

          return null
  
       
        
        }
      })
      ]
}
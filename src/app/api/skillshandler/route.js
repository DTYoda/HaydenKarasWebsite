import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try{
    var body = await req.json();
  }
  catch(error){
    console.log(error);
    return NextResponse.json({ success: false, message: "Error processing request" }, { status: 500 });
  }
    try {
      // Insert the user into the database
      if(body.type == "new")
      {
          const newSkill = await prisma.skills.create({
            data: {
              category: body.category,
              name: body.name,
              description: body.description
            }
          });
      }
      else if(body.type == "edit")
      {
        const editSkill = await prisma.skills.updateMany(
          {
            where: {
              name: body.oldName
            },
            data: {
              category: body.category,
              name: body.name,
              description: body.description
            }
          }
        );
      }
      else if(body.type == "delete")
      {
         const deleteSkill = await prisma.skills.deleteMany({
           where: {
             name: body.name
           }
         });
      }
      
      return NextResponse.json({ success: true, message: "Data received!", data: body }, {status: 200}); // Respond with the created user
    } catch (error) {
      console.log(error);
      return NextResponse.json({ success: false, message: "Error processing request" }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
}
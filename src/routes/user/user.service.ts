// services/index.service.ts
import prisma from "../../libs/prisma";
import { TCreateUser } from "../../schema/user";
export const sampleService = async (data: TCreateUser) => {
 
  //? create user
  //? update user
  await  prisma.design.create({
    data: {
      name: data.name,
      userId: 'hello',
      canvasData: 'hello',
      width: 1,
      height: 1,
      category:'Logo'
    }
  })
}

export const sampleService2 = async () => {
  //? get

  return []
}
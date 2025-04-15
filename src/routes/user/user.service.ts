// services/index.service.ts
import prisma from "../../libs/prisma";
import { TCreateUser } from "../../schema/user";
export const sampleService = async (data: TCreateUser) => {
 
  //? create user
  //? update user
  await  prisma.user.create({
    data: {
      name: data.name
    }
  })
}

export const sampleService2 = async () => {
  //? get

  return []
}
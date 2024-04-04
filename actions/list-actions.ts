"use server";

import prisma from "@/lib/db";
import { getCurrentCompany } from "@/lib/helpers";
import { combineDateAndTimeToUTC, convertDateToISOString } from "@/lib/utils";
import { listSchema } from "@/schemas";
import { getServerSession } from "next-auth";

export const addList = async (serviceId: string, data: any) => {
  try {
    if (!serviceId) return { success: false, error: "Service Id is required" };

    const currentCompany = await getCurrentCompany();
    if (!currentCompany) return { success: false, error: "Unauthorized" };

    const validData = listSchema.safeParse(data);

    if (!validData.success) return { success: false, error: "Invalid inputs" };

    const fullStartDate = combineDateAndTimeToUTC(
      validData.data.startDate,
      "00:00"
    );
    const fullEndDate = combineDateAndTimeToUTC(
      validData.data.endDate,
      "23:45"
    );

    const overlapedDate = await prisma.list.findMany({
      where: {
        serviceId,

        startDate: {
          lte: fullEndDate,
        },

        endDate: {
          gte: fullStartDate,
        },
      },
    });

    if (!!overlapedDate.length)
      return {
        success: false,
        error: "Dates are overlaping with another list",
      };

  

    const list = await prisma.list.create({
      data: {
        serviceId,
        startDate: fullStartDate,
        endDate: fullEndDate,
        label: validData.data.label,
        pricings: validData.data.pricings,
      },
    });
 
    return { success: true, message: "Successfully Created" };
  } catch (error) {
    return { success: false, error: "Something went wrong" };
  }
};

export const editList = async (
  serviceId: string,
  listId: string,
  data: any
) => {
  try {
    if (!serviceId) return { success: false, error: "Service Id is required" };
    if (!listId) return { success: false, error: "List id Id is required" };

    const currentCompany = await getCurrentCompany();
    if (!currentCompany) return { success: false, error: "Unauthorized" };

    const listToEdit = await prisma.list.findUnique({
      where: {
        id: listId,
        serviceId: serviceId,
        service: {
          entity: {
            company: {
              email: currentCompany.email,
            },
          },
        },
      },
    });

    if (!listToEdit) return { success: false, error: "Unauthorized" };

    const validData = listSchema.safeParse(data);

    if (!validData.success) return { success: false, error: "Invalid inputs" };

    const fullStartDate = combineDateAndTimeToUTC(
      validData.data.startDate,
      "00:00"
    );
    const fullEndDate = combineDateAndTimeToUTC(
      validData.data.endDate,
      "23:45"
    );

    const overlapedDate = await prisma.list.findMany({
      where: {
        serviceId,
        id: { not: listId },

        startDate: {
          lte: fullEndDate,
        },

        endDate: {
          gte: fullStartDate,
        },
      },
    });

    if (!!overlapedDate.length)
      return {
        success: false,
        error: "Dates are overlaping with another list",
      };





    const list = await prisma.list.update({
      where: {
        id: listId,
      },
      data: {
        startDate: fullStartDate,
        endDate: fullEndDate,
        label: validData.data.label,
        pricings: validData.data.pricings,
      },
    });

    return { success: true, message: "Successfully Updated" };
  } catch (error) {
    console.log("error", error);
    return { success: false, error: "Something went wrong" };
  }
};

export const deleteList = async (serviceId: string, listId: string) => {
  try {
    if (!serviceId) return { success: false, error: "Service Id is required" };
    if (!listId) return { success: false, error: "List id Id is required" };

    const currentCompany = await getCurrentCompany();
    if (!currentCompany) return { success: false, error: "Unauthorized" };

    const listToEdit = await prisma.list.findUnique({
      where: {
        id: listId,
        serviceId: serviceId,
        service: {
          entity: {
            company: {
              email: currentCompany.email,
            },
          },
        },
      },
    });

    if (!listToEdit) return { success: false, error: "Unauthorized" };

    await prisma.list.delete({
      where: {
        id: listId,
        serviceId: serviceId,
      },
    });

    return { success: true, message: "Successfully Deleted" };
  } catch (error) {
    console.log("error", error);
    return { success: false, error: "Something went wrong" };
  }
};

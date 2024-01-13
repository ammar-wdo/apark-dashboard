import prisma from "@/lib/db";
import { generateUniquePattern } from "./generateId";

export const generateBookingCode = async()=>{

    let bookingCode = generateUniquePattern();
    let existingBooking = await prisma.booking.findFirst({
      where: {
        bookingCode: bookingCode,
      },
      select: { bookingCode: true },
    });

    while (existingBooking) {
      bookingCode = generateUniquePattern();
      existingBooking = await prisma.booking.findFirst({
        where: {
          bookingCode: bookingCode,
        },
        select: { bookingCode: true },
      });
    }

    return bookingCode
}
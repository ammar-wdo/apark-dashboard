import prisma from "@/lib/db";
import { Booking } from "@prisma/client";
import axios from "axios";

export const sendEmail = async (
  booking: Booking,
  type: "refund" | "no-refund" | "update",
  name: string
) => {
  const object = {
    id: booking.id,
    service: name,
    email:booking.email,
    bookingCode: booking.bookingCode,
    arrivalString: `${booking.arrivalDate.getDate()}-${
      booking.arrivalDate.getMonth() + 1
    }-${booking.arrivalDate.getFullYear()} ${booking.arrivalTime}`,
    departureString: `${booking.departureDate.getDate()}-${
      booking.departureDate.getMonth() + 1
    }-${booking.departureDate.getFullYear()} ${booking.departureTime}`,
    firstName: booking.firstName,
    lastName: booking.lastName,
  };

  if (type === "refund") {
    try {
      await axios.post(
        "https://webhooks.integrately.com/a/webhooks/db2d6b294808450ca975ebe2fd02b699",
        object
      );
    } catch (error) {
      await prisma.notification.create({
        data: {
          IdHolder: booking.id,
          isAdmin: true,
          status: "DELETE",
          type: "BOOKING",
          message: `An error happened, the user with booking code ${booking.bookingCode} did not recieve a cancelation with refund message and should be sent maually to this email ${booking.email}`,
        },
      });
      console.log(error);
    }
  }
  if (type === "no-refund") {
    try {
      await axios.post(
        "https://webhooks.integrately.com/a/webhooks/b6f55982a9ed4f75902dd68038479036",
        object
      );
    } catch (error) {
      await prisma.notification.create({
        data: {
          IdHolder: booking.id,
          isAdmin: true,
          status: "DELETE",
          type: "BOOKING",
          message: `An error happened, the user with booking code ${booking.bookingCode} did not recieve a cancelation with NO refund message and should be sent maually to this email ${booking.email}`,
        },
      });
      console.log(error);
    }
  }
  if (type === "update") {
    try {
      await axios.post(
        "https://webhooks.integrately.com/a/webhooks/9df543865a9144498ddadaf80c78f15a",
        object
      );
    } catch (error) {
      await prisma.notification.create({
        data: {
          IdHolder: booking.id,
          isAdmin: true,
          status: "DELETE",
          type: "BOOKING",
          message: `An error happened, the user with booking code ${booking.bookingCode} did not recieve an update message and should be sent maually to this email ${booking.email}`,
        },
      });
      console.log(error);
    }
  }
};

import prisma from "@/lib/db";

import { NextResponse } from "next/server";
import { calculateParkingDays } from "./(helpers)/findParkingDays";

import { findValidServices } from "./(helpers)/findValidServices";
import { Key, ParkingLocation, ParkingType } from "@prisma/client";
import { getClientDates } from "./(helpers)/getClientDates";
import { handleTimezone } from "@/lib/timezone-handler";
import { getFinalDates } from "./(helpers)/getFinalDates";
import { getCurrentDateInNetherlands } from "../checkout/update/(helpers)/toAmsterdam";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const airport = searchParams.get("airport") as string;
  const startDate = searchParams.get("startDate") as string;
  const endDate = searchParams.get("endDate") as string;
  const startTime = searchParams.get("startTime") as string;
  const endTime = searchParams.get("endTime") as string;

  const serviceType = searchParams.getAll("serviceType") as
    | ParkingType[]
    | undefined;
  const location = searchParams.getAll("location") as
    | ParkingLocation[]
    | undefined;
  const carsKey = searchParams.getAll("carsKey") as Key[] | undefined;
  const electric = searchParams.get("electric") as string | undefined;

  if (!airport || !startDate || !endDate || !startTime || !endTime)
    return new NextResponse("date and time is required", { status: 400 });

  const { adjustedStartDate, adjustedEndDate } = getFinalDates(
    startDate,
    endDate,
    startTime,
    endTime
  );

  // const amesterdam = new Date();

  // amesterdam.setHours(amesterdam.getHours() + 1);

  // amesterdam.setMinutes(amesterdam.getMinutes());

  if (adjustedStartDate.getTime() < getCurrentDateInNetherlands().getTime()) {
    console.log("bigger");

    return NextResponse.json(
      {
        response: `Aankomstdatum moet later zijn dan de huidige datum in Nederland  -  ${new Date().toLocaleString(
          "en-US",
          { timeZone: "Europe/Amsterdam", hour: "numeric", minute: "numeric" }
        )}`,
      },
      { status: 200 }
    );
  }

  if (adjustedStartDate.getTime() >= adjustedEndDate.getTime()) {
    return NextResponse.json(
      { response: "Vertrekdatum moet later zijn dan de aankomstdatum." },
      { status: 200 }
    );
  }

  try {
    const airportCheck = await prisma.airport.findUnique({
      where: {
        slug: airport,
      },
    });

    console.log("airport check", airportCheck);

    if (!airportCheck) {
      return NextResponse.json(
        { response: "Invalid airport slug" },
        { status: 200 }
      );
    }

    const services = await prisma.service.findMany({
      where: {
        entity: { airport: { slug: airport } },
        isActive: true,
        ...(serviceType?.length ? { parkingType: { in: serviceType } } : {}),
        ...(location?.length ? { parkingLocation: { in: location } } : {}),
        ...(carsKey?.length ? { keyStatus: { in: carsKey } } : {}),
        ...(electric ? { electricCharging: true } : {}),
      },

      include: {
        bookings: {
          where: {
            paymentStatus: { in: ["SUCCEEDED", "PENDING"] },
            bookingStatus: "ACTIVE",
            AND: [
              { arrivalDate: { lte: adjustedEndDate } },
              { departureDate: { gte: adjustedStartDate } },
            ],
          },
        },
        entity: {
          select: {
            entityName: true,
            slug: true,
            airport: { select: { name: true, slug: true } },
          },
        },
        availability: true,
        rules: true,
        reviews: {
          where: {
            status: "ACTIVE",
          },
          select: {
            id: true,
            rate: true,
          },
        },
      },
    });

    const parkingDays = calculateParkingDays(
      adjustedStartDate,
      adjustedEndDate
    );

    const validServices = findValidServices(
      services,
      startDate,
      endDate,
      startTime,
      endTime,
      parkingDays
    );

    const returnedServices = validServices.map((service) => {
      const {
        bookings,
        availability,
        rules,
        arrivalTodos,
        bookingsEmail,
        departureTodos,
        distanceToAirport,
        facilities,
        generalInformation,
        importantInfo,
        images,
        pricings,
        terms,
        timeToAirport,

        ...rest
      } = service;

      return rest;
    });

    const finalValid = returnedServices.filter(
      (service) => service.available === true && service.totalPrice > 0
    );
    console.log("final valid services", finalValid.length);
    const invalidServices = services.filter((service) => {
      if (finalValid.some((valid) => valid.id === service.id)) return false;
      else return true;
    });

    const finalInvalid = invalidServices.map((service) => {
      const {
        bookings,
        availability,
        rules,
        arrivalTodos,
        bookingsEmail,
        departureTodos,
        distanceToAirport,
        facilities,
        generalInformation,
        importantInfo,
        images,
        pricings,
        terms,
        timeToAirport,

        ...rest
      } = service;

      return rest;
    });

    return NextResponse.json({
      valid: finalValid,
      invalid: finalInvalid,
      total: services.length,
      totalValid: finalValid.length,
      totalInvalid: finalInvalid.length,
    });
  } catch (error) {
    console.log("failded to fetch services", error);
    return new NextResponse("internal error", { status: 500 });
  }
}

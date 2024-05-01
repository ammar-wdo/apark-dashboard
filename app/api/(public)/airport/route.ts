import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const airports = await prisma.airport.findMany({
      select: {
        id: true,
        name: true,
        images: true,
        slug: true,
        entities: { select: { services: { select: { pricings: true } } } },
      },
      orderBy: { createdAt: "asc" },
    });
    console.log(airports.length);

   const refinedAirports =  airports.map(airport => {
        // Initialize an array to collect all seventh day prices
        let seventhDayPrices:number[] = [];
    
        airport.entities.forEach(entity => {
          entity.services.forEach(service => {
            // Check if the pricings array has at least seven elements
            if (service.pricings && service.pricings.length > 6) {
              seventhDayPrices.push(service.pricings[6]); // Collect the seventh day price
            }
          });
        });
    
        // Calculate the cheapest seventh day price
        const cheapestSeventhDayPrice = seventhDayPrices.length > 0 ? Math.min(...seventhDayPrices) : null;
    
        // Return airport info with the added cheapest seventh day price
        return {
          id: airport.id,
          name: airport.name,
          images:airport.images,
          slug:airport.slug,
          cheapestSeventhDayPrice
        };
      })




    
    return NextResponse.json({ airports:refinedAirports }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Heading from "@/components/heading";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
import { DataTable } from "./(components)/data-table";
import { columns } from "./(components)/columns";
import { redirect } from "next/navigation";

type Props = {
  params: { companyId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const page = async ({ params, searchParams }: Props) => {

    const session = await getServerSession(authOptions);

    const company = await prisma.company.findUnique({
      where: {
        email: session?.user?.email as string,
      },
    });

    if (!company) throw Error("Unauthenticated");



  if (!searchParams.page) {
    searchParams.page = "1";
  }

  if (+searchParams.page <= 0) {
    redirect("/");
  }
  const ITEMS_PER_PAGE = 6;
  const bookingsCount = await prisma.booking.count({
    where:{
        service:{
            companyId:company.id
        }
    }
  });
  const totalPages = Math.ceil(bookingsCount / ITEMS_PER_PAGE);
  const isLastPage = +searchParams.page >= totalPages ;






  const bookings = await prisma.booking.findMany({
    where: {
      service: {
        companyId: company.id,
      },
    },
    include: {
      service: true,
    },
    take: ITEMS_PER_PAGE,
    skip: ITEMS_PER_PAGE * (+searchParams.page -1),
    orderBy:{
      createdAt:'desc'
    }
  });

  return (
    <div className=" ">
      <Heading title="Bookings" description="Check your ookings" />

      <div className="">
        <DataTable
          columns={columns}
          data={bookings}
          page={searchParams.page as string}
          isLastPage={isLastPage}
          itemsPerPage={ITEMS_PER_PAGE}
          bookingsCount={bookingsCount}
        />
      </div>
    </div>
  );
};

export default page;

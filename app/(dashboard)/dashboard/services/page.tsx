import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Heading from "@/components/heading";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: { companyId: string };
};

const page = async ({ params }: Props) => {

  const session = await getServerSession(authOptions)
  const company = await prisma.company.findUnique({
    where: {
      email: session?.user?.email as string,
    },
    include: {
      services: true,
    },
  });

  if (!company) return redirect("/");

  return (
    <div className="p-32 ">
      <Heading title="Services" description="Manage your services" />

      {company.services.length === 0 ? (
        <div>no services added</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 ">
          {company.services.map(service=><div className="text-xs overflow-hidden" key={service.id}>
            {JSON.stringify(service)}

            <Link className="block p-3 bg-red-500 text-white w-fit mt-10" href={`/dashboard/services/${service.id}`}>EDIT</Link>
            <Link className="block p-3 bg-emerald-500 text-white w-fit mt-10" href={`/dashboard/services/${service.id}/pricing`}>Check pricings</Link>

          </div>)}
        </div>
      )}

      <Link className="inline-block mt-20" href={`/dashboard/services/new`}>Add service</Link>
    </div>
  );
};

export default page;

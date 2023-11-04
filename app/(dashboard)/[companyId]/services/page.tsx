import Heading from "@/components/heading";
import prisma from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: { companyId: string };
};

const page = async ({ params }: Props) => {
  const company = await prisma.company.findUnique({
    where: {
      id: params.companyId,
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

            <Link className="block p-3 bg-red-500 text-white w-fit mt-10" href={`/${company.id}/services/${service.id}`}>EDIT</Link>

          </div>)}
        </div>
      )}

      <Link href={`/${company.id}/services/new`}>Add service</Link>
    </div>
  );
};

export default page;

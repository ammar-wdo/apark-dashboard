import Heading from "@/components/heading";
import prisma from "@/lib/db";
import React from "react";
import ServiceForm from "./(components)/service-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getCurrentCompany } from "@/lib/helpers";
import { notFound, redirect } from "next/navigation";
import ErrorHolder from "../../(components)/error-holder";

type Props = { params: { serviceId: string } };

const page = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  const company = await getCurrentCompany();
  if (!company)
    return <ErrorHolder />

  const service = await prisma.service.findUnique({
    where: { id: params.serviceId },
  });

  if (!service && params.serviceId !== "new") return notFound();

  const airports = await prisma.airport.findMany({
    select: { id: true, name: true },
  });
  const entities = await prisma.entity.findMany({
    where: { companyId: company?.id },
    select: { id: true, entityName: true },
  });

  return (
    <div>
      <Heading
        title={service ? "Bewerk uw service" : "Service toevoegen"}
        description={
          service ? `${service.name} bewerken` : "Service informatie toevoegen"
        }
      />

      <ServiceForm
        service={service}
        airports={airports}
        entities={entities}
        isCompany={session?.user?.name === "Company"}
        entityId={company?.id}
      />
    </div>
  );
};

export default page;

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Airport, Entity } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type FullEntity = Entity & { airport: { name: string } };

type Props = {
  entities: FullEntity[];
};

const EntitiesTable = ({ entities }: Props) => {
  return (
    <>
      {!entities.length && (
        <p className="p-3 text-center text-3xl font-bold text-gray-600 capitalize">
          No entities
        </p>
      )}
      <section className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
        {entities.map((entity) => (
          <div key={entity.id} className="border rounded-md shadow-md transition hover:shadow-lg">
            <div className="relative aspect-video w-full">
              <Image
                alt="entity image"
                src={entity.images[0]}
                fill
                className="object-contain"
              />
            </div>
            <div className="p-3 flex flex-col ga-3 text-sm ">
              <h3 className="font-bold text-lg mb-1">General informations</h3>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground capitalize">
                  {" "}
                  name:
                </span>{" "}
                {entity.entityName}
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground capitalize">
                  {" "}
                  email:
                </span>{" "}
                {entity.email}
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground capitalize">
                  {" "}
                  airport:
                </span>{" "}
                {entity.airport.name}
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground capitalize">
                  {" "}
                  address:
                </span>{" "}
                {entity.entityAddress}
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground capitalize">
                  {" "}
                  place:
                </span>{" "}
                {entity.entityPlace}
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground capitalize">
                  {" "}
                  zipcode:
                </span>{" "}
                {entity.entityZipcode}
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground capitalize">
                  {" "}
                  phone:
                </span>{" "}
                {entity.phone}
              </p>
            </div>
            <Separator />
            <div className="p-3 flex flex-col ga-3 text-sm  mt-3">
              <h3 className="font-bold text-lg mb-1">
                Bank/invoice information
              </h3>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground capitalize">
                  {" "}
                  invoice email:
                </span>{" "}
                {entity.invoiceEmail}
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground capitalize">
                  {" "}
                  contact person:
                </span>{" "}
                {entity.contactPerson}
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground capitalize">
                  {" "}
                  chamber of commerce:
                </span>{" "}
                {entity.chamberOfCommerce}
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground capitalize">
                  {" "}
                  vat no:
                </span>{" "}
                {entity.vatNO}
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground capitalize">
                  {" "}
                  IBAN:
                </span>{" "}
                {entity.IBAN}
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground capitalize">
                  {" "}
                  address:
                </span>{" "}
                {entity.invoiceAddress}
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground capitalize">
                  {" "}
                  zipcode:
                </span>{" "}
                {entity.invoiceZipcode}
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground capitalize">
                  {" "}
                  place:
                </span>{" "}
                {entity.invoicePlace}
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground capitalize">
                  {" "}
                  country:
                </span>{" "}
                {entity.invoiceCountry}
              </p>
            </div>
            <Separator />
            <div className="p-3 flex flex-col ga-3 text-sm  mt-3">
              <h3 className="font-bold text-lg mb-1">Status</h3>
              <div className="flex items-center justify-between ">
                {entity.isActive ? (
                  <Badge className="text-green-500 bg-green-500/20 hover:bg-green-500/20 p-1 px-3 rounded-full">
                    Active
                  </Badge>
                ) : (
                  <Badge className="text-red-500 bg-red-500/20 hover:bg-red-500/20 p-1 px-3 rounded-full">
                    inActive
                  </Badge>
                )}

                <Button asChild variant={'link'}><Link href={`/dashboard/services?entityId=${entity.id}`}>Check services</Link></Button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default EntitiesTable;

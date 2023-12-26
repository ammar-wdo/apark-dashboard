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
      <section className="flex flex-wrap  gap-4">
        {entities.map((entity) => (
          <div key={entity.id} className="border rounded-md  transition  max-w-[375px] w-full separate">
            <div className="relative w-full aspect-video">
              <Image alt="entity image" fill src={entity.images[0]} className="object-contain"/>
            </div>
            
            <div className="p-3 flex flex-col ga-3 text-lg ">
           
              <h3 className=" text-xl text-foreground font-bold py-4">
             
                {entity.entityName}
              </h3>
              <p className="text-muted-foreground">
               
                {entity.email}
              </p>
           
              <p className="text-muted-foreground">
              
                {entity.entityAddress}
              </p>
            
              <p className="text-muted-foreground">
              {entity.entityZipcode} 
              {" "}
                {entity.entityPlace}
              </p>
           
              <p className="text-muted-foreground">
               
                {entity.phone}
              </p>
            </div>
            <Separator />
           
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

                <Button asChild variant={'secondary'}><Link href={`/dashboard/services?entityId=${entity.id}`}>Check services</Link></Button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default EntitiesTable;

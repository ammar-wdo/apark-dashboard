import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Airport, Entity } from "@prisma/client"
import Link from "next/link"



  type FullEntity = 
    Entity &{airport :{name:string}}
  
  type Props = {
    entities : FullEntity[]
  }
  
  const EntitiesTable = ({entities}: Props) => {
    return (
        <Table>
    
        <TableHeader>
          <TableRow>
            <TableHead >Email</TableHead>
            <TableHead >Name</TableHead>
            <TableHead>Airport</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Place</TableHead>
            <TableHead className="dark:text-white text-black font-semibold">Services</TableHead>
           
          </TableRow>
        </TableHeader>
        <TableBody>
        {entities.map(entity=>   <TableRow key={entity.id}>
           <TableCell  className="font-medium">{entity.email}</TableCell>
           <TableCell  className="font-medium">{entity.entityName}</TableCell>
           <TableCell  className="font-medium">{entity.airport.name}</TableCell>
           <TableCell  className="font-medium">{entity.entityAddress}</TableCell>
           <TableCell  className="font-medium">{entity.entityPlace}</TableCell>
           <TableCell  className="font-medium"><Link href={`/dashboard/services?entityId=${entity.id}`} className="py-1 px-3 dark:bg-white/25 dark:border-white border rounded-md  ">Manage services</Link></TableCell>
           
          
          </TableRow>)}
        </TableBody>
      </Table>
    )
  }
  
  export default EntitiesTable
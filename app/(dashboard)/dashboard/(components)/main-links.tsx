"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MainSheet from "./main-sheet";
import { BookmarkCheck, Boxes, Building2, Group, LayoutDashboard } from "lucide-react";
import SignoutButton from "./signout-button";
import { ModeToggle } from "@/components/theme-toggle";

type Props = {isAdmin:boolean};

const MainLinks = ({isAdmin}: Props) => {
  const pathname = usePathname();

  const myLinks = [
    {
      label:"dashboard",
      active:pathname==='/dashboard',
      link:'/dashboard',
      Icon:<LayoutDashboard className='w-5 h-5 mr-3' /> 

    },

    {
      label: "services",
      active: pathname === "/dashboard/services",
      link: "/dashboard/services",
      Icon:<Boxes className="w-5 h-5 mr-3" />
    },
    {
      label: "bookings",
      active: pathname === "/dashboard/bookings",
      link: "/dashboard/bookings",
      Icon:<BookmarkCheck className="w-5 h-5 mr-3" />
    },

  
  ];


  const entity = {
    label: "entities",
    active: pathname === "/dashboard/entities",
    link: "/dashboard/entities",
    Icon:<Building2 className="w-5 h-5 mr-3" />
  }
  return (
    <div className="w-full flex flex-col mt-16 p-1 px-3 gap-1 flex-1 ">
      {myLinks.map((link,i) => <span key={i===1?entity.label:link.label}>
      {isAdmin && i===1 && <Link
       
          href={entity.link}
          className={cn(
            "link",
            entity.active && "bg-secondary ",!entity.active && 'hover:bg-secondary/60'
          )}
        >
         {entity.Icon} {entity.label}
        </Link> }
     {   <Link
    
          href={link.link}
          className={cn(
            "link",
            link.active && "bg-secondary ",!link.active && 'hover:bg-secondary/60'
          )}
        >
         {link.Icon} {link.label}
        </Link>}
        </span>
      )}
     
      <ModeToggle />
       <SignoutButton />
     
    </div>
  );
};

export default MainLinks;

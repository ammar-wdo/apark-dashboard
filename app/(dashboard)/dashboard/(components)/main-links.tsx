"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MainSheet from "./main-sheet";
import { BookmarkCheck, Boxes } from "lucide-react";

type Props = {};

const MainLinks = (props: Props) => {
  const pathname = usePathname();

  const myLinks = [
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
  return (
    <div className="w-full flex flex-col mt-16 p-3 space-y-2">
      {myLinks.map((link) => (
        <Link
          href={link.link}
          className={cn(
            "text-lg dark:text-primary-foreground capitalize p-5 duration-200 rounded-md flex items-center",
            link.active && "bg-primary text-muted",!link.active && 'hover:bg-secondary/60'
          )}
        >
         {link.Icon} {link.label}
        </Link>
      ))}
     
    </div>
  );
};

export default MainLinks;

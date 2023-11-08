"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MainSheet from "./main-sheet";

type Props = {};

const MainLinks = (props: Props) => {
  const pathname = usePathname();

  const myLinks = [
    {
      label: "services",
      active: pathname === "/dashboard/services",
      link: "/dashboard/services",
    },
    {
      label: "bookings",
      active: pathname === "/dashboard/bookings",
      link: "/dashboard/bookings",
    },
  ];
  return (
    <div className="w-full flex flex-col mt-16 p-3 space-y-2">
      {myLinks.map((link) => (
        <Link
          href={link.link}
          className={cn(
            "text-lg text-white uppercase p-5 duration-200 rounded-md",
            link.active && "bg-white text-primary",!link.active && 'hover:bg-white/10'
          )}
        >
          {link.label}
        </Link>
      ))}
     
    </div>
  );
};

export default MainLinks;

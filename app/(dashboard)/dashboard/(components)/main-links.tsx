"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MainSheet from "./main-sheet";
import { Bell, BookmarkCheck, Boxes, Building2, Group, LayoutDashboard, MessageSquare } from "lucide-react";
import SignoutButton from "./signout-button";
import { ModeToggle } from "@/components/theme-toggle";
import { useNotificationsQuery } from "../notifications/notifications.hook";
import { Button } from "@/components/ui/button";

type Props = {isAdmin:boolean};

const MainLinks = ({isAdmin}: Props) => {
  const pathname = usePathname();
  const router = useRouter()

  const { data } = useNotificationsQuery();

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

  const activities = [
    {
      label: "notifications",
      active: pathname === "/dashboard/notifications",
      link: "/dashboard/notifications",
      Icon: <Bell className="w-5 h-5 mr-3" />,
      count: data?.count > 0,
    },
    {
      label: "reviews",
      active: pathname === "/dashboard/reviews",
      link: "/dashboard/reviews",
      Icon: <MessageSquare className="w-5 h-5 mr-3" />,
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
       <h3 className="font-semibold px-4 ">Main</h3>
      {myLinks.map((link,i) => <span key={i===1?entity.label:link.label}>
      {isAdmin && i===1 && <Button
        onClick={()=>{router.push(link.link);router.refresh()}}
        key={link.label}
      variant={'ghost'}
        className={cn(
          "link justify-start",
          link.active && "bg-secondary ",
          !link.active && "hover:bg-secondary/60"
        )}
        >
         {entity.Icon} {entity.label}
        </Button> }
     {   <Button
    
    onClick={()=>{router.push(link.link);router.refresh()}}
    key={link.label}
  variant={'ghost'}
    className={cn(
      "link justify-start",
      link.active && "bg-secondary ",
      !link.active && "hover:bg-secondary/60"
    )}
        >
         {link.Icon} {link.label}
        </Button>}
        </span>
      )}
         <h3 className="font-semibold px-4 mt-12">Activites</h3>
     
        <Button
        
          key={activities[0].label}
          variant={'ghost'}
          onClick={()=>{router.push(activities[0].link);router.refresh()}}
          className={cn(
            "link justify-start",
            activities[0].active && "bg-secondary ",
            !activities[0].active && "hover:bg-secondary/60"
          )}
        >
          <span className="relative">
            {activities[0].Icon}{" "}
            {activities[0].count && data?.count > 0 && (
              <span className="flex items-center justify-center text-white bg-rose-500 rounded-full text-[8px] -top-1 right-2  w-3 h-3 absolute">
                {data?.count}
              </span>
            )}
          </span>{" "}
          {activities[0].label}
        </Button>
        <Button
        
          key={activities[1].label}
          onClick={()=>{router.push(activities[1].link);router.refresh()}}
          variant={'ghost'}
          className={cn(
            "link justify-start",
            activities[1].active && "bg-secondary ",
            !activities[1].active && "hover:bg-secondary/60"
          )}
        >
          <span className="relative">
            {activities[1].Icon}{" "}
            {activities[1].count && data?.count > 0 && (
              <span className="flex items-center justify-center text-white bg-rose-500 rounded-full text-[8px] -top-1 right-2  w-3 h-3 absolute">
                {data?.count}
              </span>
            )}
          </span>{" "}
          {activities[1].label}
        </Button>
    
     
      <ModeToggle />
       <SignoutButton />
     
    </div>
  );
};

export default MainLinks;

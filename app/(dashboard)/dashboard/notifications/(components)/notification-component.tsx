import { cn } from "@/lib/utils";
import { Notification } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";

type Props = {
  notification: Notification;
};

const NotificationComponent = ({ notification }: Props) => {
  const formattedDate = format(
    new Date(notification.createdAt),
    "EEE, MMM/d, HH:mm"
  );
  const url =
    notification.type === "SERVICE" && notification.status === "APPROVE"
      ? `/dashboard/services/${notification.IdHolder}`
      : notification.type === "ENTITY" && notification.status === "APPROVE"
      ? `/dashboard/entities`
      : "";


      const themes :{[key:string ] :string } =  {
        
        APPROVE: 'bg-green-500/20 text-green-500',
        REQUEST: 'bg-yellow-500/20 text-yellow-500',
        DELETE: 'bg-rose-500/20 text-rose-500',
    }
   
    const showCheck = (notification.type==='ENTITY' || notification.type==='SERVICE' || notification.type==='BOOKING')&& notification.status !=='DELETE'

  return (
    <div className={cn("rounded-lg p-6 border relative flex gap-4 items-center",themes[notification.status!]||'')}>
      <p className={cn("text-sm ")}>{notification.message}</p>

      {showCheck&&<Link href={url} className="hover:underline text-blue-500 text-sm">
        Check
      </Link>}

      <p className="text-xs text-neutral-500 pt-3 absolute bottom-2 right-3">
        {formattedDate}
      </p>
    </div>
  );
};

export default NotificationComponent;

import { cn } from "@/lib/utils";
import { Notification } from "@prisma/client";
import { format } from "date-fns";
import {
  AlertTriangle,
  CheckCheck,
  CheckCircle,
  Delete,
  Loader,
} from "lucide-react";
import Link from "next/link";

type Props = {
  notification: Notification;
};

const NotificationComponent = ({ notification }: Props) => {
  const formattedDate = format(notification.createdAt, "EEE, MMM/d, HH:mm");
  const url =
    notification.type === "SERVICE"
      ? `/dashboard/services/${notification.IdHolder}`
   
      : notification.type === "ENTITY"
      ? `/dashboard/entities`
      : notification.type === "BOOKING"
      ? `/dashboard/bookings/${notification.IdHolder}`
      : "";

  const themes: { [key: string]: React.ReactElement } = {
    APPROVE: <CheckCircle className="text-green-500 w-5 h-5 flex-shrink-0" />,
    REQUEST: (
      <AlertTriangle className="text-yellow-500 w-5 h-5 flex-shrink-0" />
    ),
    DELETE: <Delete className="text-rose-500 w-5 h-5 flex-shrink-0" />,
  };

  const showCheck =
    ((notification.type === "ENTITY" || notification.type === "SERVICE") &&
      notification.status !== "DELETE") ||
    notification.type === "BOOKING";

  return (
    <div
      className={cn(
        "rounded-lg p-6  relative flex gap-4 items-center bg-slate-100 border dark:bg-slate-600",
        notification.isRead && "opacity-60"
      )}
    >
      {!notification.isRead ? (
        <span className="top-1  right-1 absolute text-neutral-500  text-xs dark:text-neutral-200">
          New
        </span>
      ) : (
        <span className="top-1  right-1 absolute  text-xs">
          <CheckCheck className="h-4 w-4 text-neutral-500 dark:text-neutral-200" />
        </span>
      )}
      {themes[notification.status!]}{" "}
      <p className={cn("text-sm text-neutral-700 dark:text-neutral-200")}>
        {notification.message}
      </p>
      {showCheck && (
        <Link
          href={url}
          className="hover:underline text-blue-500 text-sm ml-auto sm:mr-32 "
        >
          Check
        </Link>
      )}
      <p className="text-xs text-neutral-500 pt-3 absolute bottom-2 right-3 dark:text-neutral-200">
        {formattedDate}
      </p>
    </div>
  );
};

export default NotificationComponent;

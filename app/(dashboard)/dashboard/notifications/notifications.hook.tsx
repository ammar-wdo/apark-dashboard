import { useQuery,useQueryClient } from "@tanstack/react-query";

export const useNotificationsQuery = () => {
  const fetchNotifications = async () => {
    const res = await fetch("/api/notifications");
    return res.json();
  };
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval:30000
  })

  return {
    data,
    queryClient
  };
};

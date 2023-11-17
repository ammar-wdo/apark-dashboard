import { Booking, Service } from "@prisma/client";

type Services = Service & {bookings:Booking[]}

export const getTotal = (services : Services | Services[])=>{
    if (services) {
        let totalRevenue = 0;
        let monthlyRevenue = 0;
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
    
        if (Array.isArray(services)) {
          // Calculate revenue from all services
          services.forEach(service => {
            service.bookings.forEach(booking => {
              totalRevenue += booking.total;
              const bookingMonth = new Date(booking.createdAt).getMonth();
              if (bookingMonth === currentMonth) {
                monthlyRevenue += booking.total;
              }
            });
          });
        } else {
          // Calculate revenue from a single service
          services.bookings.forEach(booking => {
            totalRevenue += booking.total;
            const bookingMonth = new Date(booking.createdAt).getMonth();
            if (bookingMonth === currentMonth) {
              monthlyRevenue += booking.total;
            }
          });
        }
        
        return { totalRevenue, monthlyRevenue };
      }
      
      return { totalRevenue: 0, monthlyRevenue: 0 };

}
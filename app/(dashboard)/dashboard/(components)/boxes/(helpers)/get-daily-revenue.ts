import { Booking, Service } from "@prisma/client";

type Services = Service & {bookings:Booking[]}

export function getDailyRevenue(services : Services | Services[]) {

    
    if (services) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const revenueByDay:{[key:number]:number} = {};
  
      if (Array.isArray(services)) {
        // Calculate revenue from all services
        services.forEach(service => {
          service.bookings.forEach(booking => {
            const bookingDate = new Date(booking.createdAt);
            const bookingMonth = bookingDate.getMonth();
            const bookingYear = bookingDate.getFullYear();
  
            if (bookingMonth === currentMonth && bookingYear === currentYear) {
              const bookingDay = bookingDate.getDate();
              revenueByDay[bookingDay] = (revenueByDay[bookingDay] || 0) + booking.total;
            }
          });
        });
      } else {
        // Calculate revenue from a single service
        services.bookings.forEach(booking => {
          const bookingDate = new Date(booking.createdAt);
          const bookingMonth = bookingDate.getMonth();
          const bookingYear = bookingDate.getFullYear();
  
          if (bookingMonth === currentMonth && bookingYear === currentYear) {
            const bookingDay = bookingDate.getDate();
            revenueByDay[bookingDay] = (revenueByDay[bookingDay] || 0) + booking.total;
          }
        });
      }
  
      const chartData = Array.from({ length: daysInMonth }, (_, index) => ({
        day: index + 1,
        revenue: revenueByDay[index + 1] || 0
      }));
  
      return chartData;
    }
  
    return [];
  }
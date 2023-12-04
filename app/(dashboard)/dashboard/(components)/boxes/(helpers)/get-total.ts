import { Booking, Service } from "@prisma/client";

type Services = Service & { bookings: Booking[] };

export const getTotal = (services: Services | Services[]) => {
  if (services) {
    let totalRevenue = 0;
    let monthlyRevenue = 0;
    let totalBookings = 0;
    let monthlyBookings = 0;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
  
    if (Array.isArray(services)) {
      // Calculate revenue and bookings from all services
      services.forEach((service) => {
        service.bookings.forEach((booking) => {
          totalRevenue += booking.total;
          totalBookings++;
          const bookingMonth = new Date(booking.createdAt).getMonth();
          if (bookingMonth === currentMonth) {
            monthlyRevenue += booking.total;
            monthlyBookings++;
          }
        });
      });
    } else {
      // Calculate revenue and bookings from a single service
      services.bookings.forEach((booking) => {
        totalRevenue += booking.total;
        totalBookings++;
        const bookingMonth = new Date(booking.createdAt).getMonth();
        if (bookingMonth === currentMonth) {
          monthlyRevenue += booking.total;
          monthlyBookings++;
        }
      });
    }
    
    return { totalRevenue, monthlyRevenue, totalBookings, monthlyBookings };
  }
  
  return { totalRevenue: 0, monthlyRevenue: 0, totalBookings: 0, monthlyBookings: 0 };
};
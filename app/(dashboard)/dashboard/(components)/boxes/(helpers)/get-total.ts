import { Booking, Service } from "@prisma/client";

type Services = Service & { bookings: Booking[] };

export const getTotal = (services: Services | Services[]) => {
  if (services) {
    let totalRevenue = 0;
    let monthlyRevenue = 0;
    let totalBookings = 0;
    let monthlyBookings = 0;
    let totalCanceledBookings = 0;
    let monthlyCanceledBookings = 0;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    if (Array.isArray(services)) {
      services.forEach((service) => {
        service.bookings.forEach((booking) => {
          if (booking.paymentStatus === "SUCCEEDED") {
            totalRevenue += booking.total;
            totalBookings++;
            const bookingMonth = new Date(booking.createdAt).getMonth();
            if (bookingMonth === currentMonth) {
              monthlyRevenue += booking.total;
              monthlyBookings++;
            }
          } else if (booking.paymentStatus === "CANCELED") {
            totalCanceledBookings++;
            const bookingMonth = new Date(booking.createdAt).getMonth();
            if (bookingMonth === currentMonth) {
              monthlyCanceledBookings++;
            }
          }
        });
      });
    } else {
      services.bookings.forEach((booking) => {
        if (booking.paymentStatus === "SUCCEEDED") {
          totalRevenue += booking.total;
          totalBookings++;
          const bookingMonth = new Date(booking.createdAt).getMonth();
          if (bookingMonth === currentMonth) {
            monthlyRevenue += booking.total;
            monthlyBookings++;
          }
        } else if (booking.paymentStatus === "CANCELED") {
          totalCanceledBookings++;
          const bookingMonth = new Date(booking.createdAt).getMonth();
          if (bookingMonth === currentMonth) {
            monthlyCanceledBookings++;
          }
        }
      });
    }

    return {
      totalRevenue,
      monthlyRevenue,
      totalBookings,
      monthlyBookings,
      totalCanceledBookings,
      monthlyCanceledBookings,
    };
  }

  return {
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalBookings: 0,
    monthlyBookings: 0,
    totalCanceledBookings: 0,
    monthlyCanceledBookings: 0,
  };
};
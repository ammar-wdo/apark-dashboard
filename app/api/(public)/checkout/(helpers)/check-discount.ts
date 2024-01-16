import prisma from "@/lib/db";
import { Discount } from "@prisma/client";






export const checkDiscount = async (discountId: string, total: number,priceWithOptions:number, bookingStart: Date, bookingEnd: Date): Promise<{priceWithDiscount: number | undefined, error: string,discount:Discount | null}> => {
    if(!discountId) return { priceWithDiscount: 0, error: '' ,discount:null};
    const discount = await prisma.discount.findUnique({
        where: { id: discountId }
    });

    if (!discount) return { priceWithDiscount: 0, error: '' ,discount:null};

    const currentDate = new Date();
    const startDate = new Date(discount.startDate);
    const endDate = new Date(discount.endDate);

    // Check if discount is applicable
    const isDiscountApplicable = 
        (discount.based === "CREATING" && currentDate >= startDate && currentDate <= endDate) ||
        (discount.based === "BOOKING" && bookingStart <= endDate && bookingEnd >= startDate);

    if (!isDiscountApplicable) return { priceWithDiscount: undefined, error: 'not applicable' ,discount:null};

    // Check if FIXED type discount exceeds total amount
    if (discount.type === 'FIXED' && discount.value! >= total) {
        return { error: 'not applicable', priceWithDiscount: undefined,discount:null };
    }

    // Calculate discount value
    let discountValue = discount.type === 'FIXED' ? discount.value :
                        discount.type === 'PERCENTAGE' ? (discount.percentage! / 100) * (total+priceWithOptions) : 0;

    return { priceWithDiscount: discountValue as number, error: '' ,discount};
}
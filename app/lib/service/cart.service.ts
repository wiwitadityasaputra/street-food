import { fetchUserCartByUserAndFlag } from "./database.service";
import { USER_CART_OPTIONS_SEPARATOR, UserCartDb, UserCartResponse } from "./service.definition";

export async function getUserCarts(userId: string): Promise<UserCartResponse[]> {
    const data: UserCartDb[] = await fetchUserCartByUserAndFlag(userId, "active");
    const result: UserCartResponse[] = [];
    data.forEach(d => {
        const options: string[] = [];
        d.options.split(USER_CART_OPTIONS_SEPARATOR).forEach(o => {
            options.push(o);
        });

        result.push({
            cuisineId: d.cuisine_id,
            cuisineName: d.cuisine_name,
            userChartId: d.user_cart_id,
            pricePerItem: d.price_per_item,
            quantity: d.quantity,
            finalPrice: d.final_price,
            options: options
        });
    })
    return result;
}
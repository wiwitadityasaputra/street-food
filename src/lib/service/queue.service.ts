import {
    countUserOrders as countUserOrdersDb,
    fetchUserOrders as fetchUserOrdersDb,
    fetchAllOrders as fetchAllOrdersDb
} from '@/src/lib/database/database';
import {
    AllOrderAndCartDb,
    MyOrderAndCartDb
} from '@/src/lib/database/database.definition';
import {
    USER_CART_OPTIONS_SEPARATOR,
    MyUserOrder,
    AllUserOrder
} from '@/src/lib/service/service.definition';
import { maskingValue } from '@/src/lib/util/utils';

export async function countUserOrders(userId: string): Promise<number> {
    return countUserOrdersDb(userId);
}

export async function fetchUserOrders(userId: string): Promise<MyUserOrder[]> {
    const userOrdersDb: MyOrderAndCartDb[] = await fetchUserOrdersDb(userId);

    const orderIds: number[] = [];
    userOrdersDb.forEach(uo => {
        const finded = orderIds.find((o) => {return uo.user_order_id === o});
        if (!finded) {
            orderIds.push(uo.user_order_id);
        }
    });

    const userOrders: MyUserOrder[] = [];
    orderIds.forEach(id => {
        const filtered: MyOrderAndCartDb[] = userOrdersDb.filter(uo => id === uo.user_order_id);
        const d1 = filtered[0];

        const userOrder: MyUserOrder = {
            orderId: id,
            flagOrder: d1.flag_order,

            createdDate: d1.created_date,
            cookedDate: d1.cooked_date,
            shippedDate: d1.shipped_date,
            deliveredDate: d1.delivered_date,
            cancelledDate: d1.cancelled_date,

            firstName: d1.first_name,
            lastName: d1.last_name,
            streetAddress: d1.street_address,
            secondAddress: d1.second_address,
            city: d1.city,
            state: d1.state,
            zipCode: d1.zip_code,
            phoneNumber: d1.phone_number,
            emailAddress: d1.email_address,
            additionalInfo: d1.additional_info,

            items: []
        };

        filtered.forEach(f => {

            const options: string[] = [];
            f.options.split(USER_CART_OPTIONS_SEPARATOR).forEach(o => {
                options.push(o);
            });

            userOrder.items.push({
                cartId: f.user_cart_id,

                cuisineId: f.cuisine_id,
                cuisineName: f.cuisine_name,
                options: options,

                pricePerItem: f.price_per_item,
                quantity: f.quantity,
                finalPrice: f.final_price

            })
        });

        userOrders.push(userOrder);
    });

    return userOrders;
}

export async function fetchAllOrders(): Promise<AllUserOrder[]> {
    const allOrdersDb: AllOrderAndCartDb[] = await fetchAllOrdersDb();

    const orderIds: number[] = [];
    allOrdersDb.forEach(uo => {
        const finded = orderIds.find((o) => {return uo.user_order_id === o});
        if (!finded) {
            orderIds.push(uo.user_order_id);
        }
    });

    const allOrders: AllUserOrder[] = [];
    orderIds.forEach(id => {
        const filtered: AllOrderAndCartDb[] = allOrdersDb.filter(uo => id === uo.user_order_id);
        const d1 = filtered[0];

        const newAddress = d1.street_address.split(" ").map((a, index) => {
            return (index === 0 ? maskingValue(a) : a) + " ";
        }).join('');
        
        const order: AllUserOrder = {
            orderId: id,
            flagOrder: d1.flag_order,

            createdDate: d1.created_date,
            cookedDate: d1.cooked_date,
            shippedDate: d1.shipped_date,
            deliveredDate: d1.delivered_date,
            cancelledDate: d1.cancelled_date,

            firstName: maskingValue(d1.first_name),
            lastName: d1.last_name,
            streetAddress: newAddress,
            items: []
        };

        filtered.forEach(f => {

            const options: string[] = [];
            f.options.split(USER_CART_OPTIONS_SEPARATOR).forEach(o => {
                options.push(o);
            });

            order.items.push({
                cartId: f.user_cart_id,

                cuisineName: f.cuisine_name,
                quantity: f.quantity,
                options: options
            })
        });

        allOrders.push(order);
    });

    return allOrders;
}
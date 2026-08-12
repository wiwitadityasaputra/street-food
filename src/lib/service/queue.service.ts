import {
    countUserOrders as countUserOrdersDb,
    fetchUserOrders as fetchUserOrdersDb,
    countAllOrdersPage as countAllOrdersPageDb,
    fetchAllOrdersIdPage,
    fetchUserOrdesByids,
    fetchUserCartByids
} from '@/src/lib/database/database';
import {
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

export async function countAllOrdersPage(): Promise<number> {
    return await countAllOrdersPageDb();
}

export async function fetchAllOrdersPage(page: number, size: number): Promise<AllUserOrder[]> {
    const orderids = await fetchAllOrdersIdPage(size, (page - 1) * size);
    const ids = orderids.map(o => o.orderid);

    const userOrders = await fetchUserOrdesByids(ids);
    const carts = await fetchUserCartByids(ids);

    const result: AllUserOrder[] = [];
    ids.forEach(id => {
        const userOrder = userOrders.find(uo => uo.user_order_id === id);
        const userCarts = carts.filter(uc => uc.user_order_id === id);

        if (userOrder && userCarts && userCarts.length) {
            const newAddress = userOrder.street_address.split(" ").map((a, index) => {
                return (index === 0 ? maskingValue(a) : a) + " ";
            }).join('');

            const allUserOrder: AllUserOrder = {
                orderId: id,
                flagOrder: Number(userOrder.flag_order),

                createdDate: userOrder.created_date,
                cookedDate: userOrder.cooked_date,
                shippedDate: userOrder.shipped_date,
                deliveredDate: userOrder.delivered_date,
                cancelledDate: userOrder.cancelled_date,

                firstName: maskingValue(userOrder.first_name),
                lastName: userOrder.last_name,
                streetAddress: newAddress,
                items: []
            };

            userCarts.forEach(f => {

                const options: string[] = [];
                f.options.split(USER_CART_OPTIONS_SEPARATOR).forEach(o => {
                    options.push(o);
                });

                allUserOrder.items.push({
                    cartId: Number(f.user_cart_id),

                    cuisineName: f.cuisine_name,
                    quantity: f.quantity,
                    options: options
                })
            });

            result.push(allUserOrder);
        }
    })

    return result;
}
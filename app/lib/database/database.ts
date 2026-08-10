import postgres from 'postgres';

import {
    AllOrderAndCartDb,
    CuisinesCartDb,
    CuisinesCartDbGroupNamePrice,
    CuisinesDb,
    MyOrderAndCartDb,
    OrderDbFlag,
    UserCartDb,
    UserCartDbFlag,
    UserCartDbUserCartId
} from '@/app/lib/database/database.definition';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

function allowedCuisine(cuisine?: string) {
    if (cuisine) {
        return ["indonesian", "western", "korean", "chinese"].indexOf(cuisine) >= 0;
    }
    return false;
}

export async function fetchCuisinesByCuisine(cuisine?: string): Promise<CuisinesDb[]> {
    // await new Promise((resolve) => setTimeout(resolve, 3000));// food-list
    try {
        let data;
        if (cuisine && allowedCuisine(cuisine)) {
            data = await sql<CuisinesDb[]>`SELECT id,name,cuisine,description,price,rate,review FROM cuisines WHERE cuisine = ${cuisine}::cuisine_type ORDER BY rate DESC`;
        } else {
            data = await sql<CuisinesDb[]>`SELECT id,name,cuisine,description,price,rate,review FROM cuisines ORDER BY rate DESC`;
        }
        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

export async function fetchCuisinesById(id: string): Promise<CuisinesDb | undefined> {
    try {
        // await new Promise((resolve) => setTimeout(resolve, 3000));// addtocart
        const data = await sql<CuisinesDb[]>`SELECT id,name,cuisine,description,price,rate,review FROM cuisines WHERE id = ${id}`;
        if (data.length) {
            return data[0];
        }
        return undefined;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

export async function fetchCuisineCartByCuisineId(cuisineId: string): Promise<CuisinesCartDb[]> {
    // await new Promise((resolve) => setTimeout(resolve, 3000));// addtocart
    try {
        const data = await sql<CuisinesCartDb[]>`SELECT id,cuisine_cart_type as "cartType","group",name,price,"order" FROM cuisine_cart WHERE cuisine_id = ${cuisineId}`;
        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

export async function fetchCuisineCartPrices(sqlString: string): Promise<CuisinesCartDbGroupNamePrice[]> {
    try {
        const data = await sql.unsafe<CuisinesCartDbGroupNamePrice[]>(sqlString);
        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

export async function writeToUserCart(cuisineId: string, cuisineName: string, userId: string, pricePerItem: number, quantity: number, finalPrice: number, options: string) {
    try {
        const data = await sql`
            INSERT INTO user_cart (cuisine_id, cuisine_name, user_id, price_per_item, quantity, final_price, options, flag)
                VALUES (${cuisineId}, ${cuisineName}, ${userId}, ${pricePerItem}, ${quantity}, ${finalPrice}, ${options}, ${UserCartDbFlag.ACTIVE});`;
        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to write data.');
    }
}

export async function fetchUserCartByUserAndFlag(userId: string, flag: UserCartDbFlag): Promise<UserCartDb[]> {
    try {
        const data = await sql<UserCartDb[]>`SELECT cuisine_id,cuisine_name,user_cart_id,price_per_item,quantity,final_price,options 
            FROM user_cart WHERE user_id = ${userId} and flag=${flag}`;
        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

export async function fetchUserCartIdByUserAndFlag(userId: string, flag: UserCartDbFlag): Promise<UserCartDbUserCartId[]> {
    try {
        const data = await sql<UserCartDbUserCartId[]>`SELECT user_cart_id as usercartid FROM user_cart WHERE user_id = ${userId} and flag=${flag}`;
        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

export async function countUserCartByUserAndFlag(userId: string, flag: UserCartDbFlag): Promise<number> {
    try {
        const [{ total }] = await sql`SELECT count(*)::int AS total FROM user_cart WHERE user_id = ${userId} and flag=${flag}`;
        return total;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to count data.');
    }
}

export async function deleteUserCartByUserAndUserCartId(userId: string, userCartId: string) {
    try {
        await sql`UPDATE user_cart SET flag = ${UserCartDbFlag.DELETED} WHERE user_cart_id = ${userCartId} AND user_id = ${userId}`;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to count data.');
    }
}

export async function writeToOrder(flag: OrderDbFlag, firstName: string, lastName: string, streetAddress: string, secondAddress: string, city: string, state: string, zipCode: string, phoneNumber: string, emailAddress: string, additionalInfo: string): Promise<any> {
    try {
        const result = await sql`INSERT INTO 
            user_order (flag, created_date, first_name, last_name, street_address, second_address, city, state, zip_code, phone_number, email_address, additional_info) 
            VALUES (${flag}, current_timestamp, ${firstName}, ${lastName}, ${streetAddress}, ${secondAddress}, ${city}, ${state}, ${zipCode}, ${phoneNumber}, ${emailAddress}, ${additionalInfo}) 
            returning user_order_id as orderid`;
        return (result as any)[0].orderid;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to write data.');
    }
}

export async function updateUserCartFlagIsCooking(sqlString: string): Promise<any> {
    try {
        const data = await sql.unsafe(sqlString);
        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

export async function countUserOrders(userId: string): Promise<number> {
    try {
        const [{ total }] = await sql`SELECT count(*)::int AS total 
            FROM user_order uo 
                LEFT JOIN user_cart uc on uc.user_order_id = uo.user_order_id 
            WHERE uc.user_id = ${userId}`;
        return total;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

export async function fetchUserOrders(userId: string): Promise<MyOrderAndCartDb[]> {
    try {
        const data = await sql<MyOrderAndCartDb[]>`
            SELECT 
                uo.user_order_id,
                uo.flag as flag_order,
                uo.created_date,
                uo.cooked_date,
                uo.shipped_date,
                uo.delivered_date,
                uo.cancelled_date,
                uo.first_name,
                uo.last_name,
                uo.street_address,
                uo.second_address,
                uo.city,
                uo.state,
                uo.zip_code,
                uo.phone_number,
                uo.email_address,
                uo.additional_info,
                uc.user_cart_id,
                uc.price_per_item,
                uc.quantity,
                uc.final_price,
                uc.options,
                uc.flag as flag_cart,
                uc.cuisine_id,
                uc.cuisine_name
            FROM user_order uo LEFT JOIN user_cart uc on uc.user_order_id = uo.user_order_id 
            where uc.user_id = ${userId}`;
        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

export async function fetchAllOrders(): Promise<AllOrderAndCartDb[]> {
    try {
        const data = await sql<AllOrderAndCartDb[]>`
            SELECT 
                uo.user_order_id,
                uo.flag as flag_order,

                uo.created_date,
                uo.cooked_date,
                uo.shipped_date,
                uo.delivered_date,
                uo.cancelled_date,

                uo.first_name,
                uo.last_name,
                uo.street_address,

                uc.user_cart_id,
                uc.options,
                uc.cuisine_id,
                uc.cuisine_name,
                uc.quantity
            FROM user_order uo LEFT JOIN user_cart uc on uc.user_order_id = uo.user_order_id`;
        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

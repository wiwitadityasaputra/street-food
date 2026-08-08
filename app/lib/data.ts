import postgres from 'postgres';
import { CuisineCartPrice, Cuisines, CuisinesCart, UserCartDb } from './definition';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

function allowedCuisine(cuisine?: string) {
    if (cuisine) {
        return ["indonesian", "western", "korean", "chinese"].indexOf(cuisine) >= 0;
    }
    return false;
}

export async function fetchCuisinesByCuisine(cuisine?: string): Promise<Cuisines[]> {
    // await new Promise((resolve) => setTimeout(resolve, 3000));// food-list
    try {
        let data;
        if (cuisine && allowedCuisine(cuisine)) {
            data = await sql<Cuisines[]>`SELECT id,name,cuisine,description,price,rate,review FROM cuisines WHERE cuisine = ${cuisine}::cuisine_type ORDER BY rate DESC`;
        } else {
            data = await sql<Cuisines[]>`SELECT id,name,cuisine,description,price,rate,review FROM cuisines ORDER BY rate DESC`;
        }
        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

export async function fetchCuisinesById(id: string): Promise<Cuisines | undefined> {
    try {
        // await new Promise((resolve) => setTimeout(resolve, 3000));// addtocart
        const data = await sql<Cuisines[]>`SELECT id,name,cuisine,description,price,rate,review FROM cuisines WHERE id = ${id}`;
        if (data.length) {
            return data[0];
        }
        return undefined;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

export async function fetchCuisineCartByCuisineId(cuisineId: string): Promise<CuisinesCart[]> {
    // await new Promise((resolve) => setTimeout(resolve, 3000));// addtocart
    try {
        const data = await sql<CuisinesCart[]>`SELECT id,cuisine_cart_type as "cartType","group",name,price,"order" FROM cuisine_cart WHERE cuisine_id = ${cuisineId}`;
        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

export async function fetchCuisineCartPrices(sqlString: string): Promise<CuisineCartPrice[]> {
    try {
        const data = await sql.unsafe<CuisineCartPrice[]>(sqlString);
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
                VALUES (${cuisineId}, ${cuisineName}, ${userId}, ${pricePerItem}, ${quantity}, ${finalPrice}, ${options}, 'active');`;
        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to write data.');
    }
}

export async function fetchUserCartByUserAndFlag(userId: string, flag: string) {
    try {
        const data = await sql<UserCartDb[]>`SELECT cuisine_id,cuisine_name,user_cart_id,price_per_item,quantity,final_price,options 
            FROM user_cart WHERE user_id = ${userId} and flag=${flag}`;
        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

export async function countUserCartByUserAndFlag(userId: string, flag: string) {
    try {
        const [{ total }] = await sql`SELECT count(*)::int AS total FROM user_cart WHERE user_id = ${userId} and flag=${flag}`;
        return total;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to count data.');
    }
}
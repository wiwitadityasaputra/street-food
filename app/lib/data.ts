import postgres from 'postgres';
import { Cuisines, CuisinesChart } from './definition';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

function allowedCuisine(cuisine?: string) {
    if (cuisine) {
        return ["indonesian", "western", "korean", "chinese"].indexOf(cuisine) >= 0;
    }
    return false;
}

export async function fetchCuisinesByCuisine(cuisine?: string): Promise<Cuisines[]> {
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

export async function fetchCuisineCartByCuisineId(cuisineId: string): Promise<CuisinesChart[]> {
    try {
        const data = await sql<CuisinesChart[]>`SELECT cuisine_cart_type as "cartType","group",name,price FROM cuisine_cart WHERE cuisine_id = ${cuisineId}`;
        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}
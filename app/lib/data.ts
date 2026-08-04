import postgres from 'postgres';
import { Cuisines } from './definition';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchTest01() {
    try {
        const data = await sql`SELECT * FROM test01`;
        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

function allowedCuisine(cuisine?: string) {
    if (cuisine) {
        return ["indonesian", "western", "korean", "chinese"].indexOf(cuisine) >= 0;
    }
    return false;
}

export async function fetchCuisines(cuisine?: string): Promise<Cuisines[]> {
    try {
        let data;
        if (cuisine && allowedCuisine(cuisine)) {
            data = await sql<Cuisines[]>`SELECT id,name,cuisine,description,price,rate FROM cuisines WHERE cuisine = ${cuisine}::cuisine_type ORDER BY rate DESC`;
        } else {
            data = await sql<Cuisines[]>`SELECT id,name,cuisine,description,price,rate FROM cuisines ORDER BY rate DESC`;
        }
        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}
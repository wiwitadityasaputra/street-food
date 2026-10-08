import {
    AllUserOrderDb,
    CuisinesCartDb,
    CuisinesCartDbGroupNamePrice,
    CuisinesDb,
    CuisinesDbIdName,
    MyOrderAndCartDb,
    OrderDbFlag,
    OrderIdUserOrderDb,
    SimilarEmbedding,
    UserCartDb,
    UserCartDbFlag,
    UserCartDbUserCartId,
    UserCartFeCartApi,
    UserChatMainDb
} from '@/src/lib/database/database.definition';
import { prisma } from '@/src/lib/database/prisma';
import { cuisine_type } from '@/src/generated/prisma/enums';
import { generateEmbedding } from '@/src/lib/route/chat/util';
import { FoodSuggestion } from '../route/chat/handle-bot-response';

const ALLOWED_CUISINES: readonly string[] = Object.values(cuisine_type);

function allowedCuisine(cuisine?: string): cuisine is cuisine_type {
    return !!cuisine && ALLOWED_CUISINES.includes(cuisine);
}

export async function pingDatabase(): Promise<unknown> {
    return await prisma.$queryRaw`SELECT 1`;
}

export async function fetchCuisinesByCuisine(cuisine?: string): Promise<CuisinesDb[]> {
    if (cuisine && allowedCuisine(cuisine)) {
        return await prisma.cuisines.findMany({
            where: {
                cuisine: cuisine
            },
        });
    } else {
        return await prisma.cuisines.findMany({});
    }
}

export async function fetchCuisinesById(id: string): Promise<CuisinesDb | undefined> {
    const cuisine = await prisma.cuisines.findUnique({
        where: {
            id: Number(id)
        }
    })
    return cuisine ?? undefined;
}

export async function fetchCuisineByFoodsuggestion(suggestion: FoodSuggestion): Promise<CuisinesDbIdName[]> {
    let whereClause = "";
    let orderClause = "";

    const country = suggestion.country;
    const price = suggestion.price;
    const rate = suggestion.rate;
    const sales = suggestion.sales;

    if (country) {
        whereClause = `WHERE cuisine = '${country}'`;
    }
    if (price || rate || sales) {
        const orderList = [];
        if (price) {
            orderList.push(` price ${price === "cheap" ? "ASC" : "DESC"} `);
        }
        if (rate) {
            orderList.push(` rate ${rate === "lowest" ? "ASC" : "DESC"} `);
        }
        if (sales) {
            orderList.push(` review ${sales === "lowest" ? "ASC" : "DESC"} `);
        }

        orderClause = `ORDER BY ${orderList.join(", ")}`;
    }

    const query = `
        SELECT
            id as cuisineid,
            name as cuisinename
        FROM cuisines
        ${whereClause}
        ${orderClause}
        LIMIT 3
    `;

    return await prisma.$queryRawUnsafe<CuisinesDbIdName[]>(query);
}

export async function fetchCuisineCartByCuisineId(cuisineId: string): Promise<CuisinesCartDb[]> {
    const carts = await prisma.cuisine_cart.findMany({
        where: {
            cuisine_id: Number(cuisineId)
        }
    });

    return carts.map((cart) => ({
        id: cart.id,
        cartType: cart.cuisine_cart_type,
        group: cart.group,
        name: cart.name,
        price: cart.price,
        order: cart.order,
    }));
}

export async function fetchCuisineCartPrices(sqlString: string): Promise<CuisinesCartDbGroupNamePrice[]> {
    return await prisma.$queryRawUnsafe<CuisinesCartDbGroupNamePrice[]>(sqlString);
}

export async function writeToUserCart(cuisineId: string, cuisineName: string, userId: string, pricePerItem: number, quantity: number, finalPrice: number, options: string) {
    return await prisma.user_cart.create({
        data: {
            cuisine_id: Number(cuisineId),
            cuisine_name: cuisineName,
            user_id: userId,
            price_per_item: pricePerItem,
            quantity: quantity,
            final_price: finalPrice,
            options: options,
            flag: String(UserCartDbFlag.ACTIVE)
        }
    });
}

export async function fetchUserCartByUserAndFlag(userId: string, flag: UserCartDbFlag): Promise<UserCartDb[]> {
    return await prisma.user_cart.findMany({
        where: {
            user_id: userId,
            flag: String(flag)
        }
    });
}

export async function fetchUserCartIdByUserAndFlag(userId: string, flag: UserCartDbFlag): Promise<UserCartDbUserCartId[]> {
    const carts = await prisma.user_cart.findMany({
        where: {
            user_id: userId,
            flag: String(flag)
        },
        select: {
            user_cart_id: true
        }
    });

    return carts.map((cart) => ({
        usercartId: cart.user_cart_id
    }));
}

export async function fetchUserCartIdByUseridAndCuisinename(userId: string, cuisineName: string): Promise<UserCartFeCartApi[]> {
    const carts = await prisma.user_cart.findMany({
        where: {
            user_id: userId,
            cuisine_name: cuisineName,
            flag: String(UserCartDbFlag.ACTIVE)
        },
        select: {
            user_cart_id: true,
            options: true,
            final_price: true
        }
    });

    return carts.map(c => {
        return {
            userCartId: c.user_cart_id,
            options: c.options,
            finalPrice: c.final_price
        }
    });
}

export async function countUserCartByUserAndFlag(userId: string, flag: UserCartDbFlag): Promise<number> {
    return await prisma.user_cart.count({
        where: {
            user_id: userId,
            flag: String(flag)
        }
    });
}

export async function deleteUserCartByUserAndUserCartId(userId: string, userCartId: string) {
    return await prisma.user_cart.updateMany({
        where: {
            user_cart_id: Number(userCartId),
            user_id: userId
        },
        data: {
            flag: String(UserCartDbFlag.DELETED)
        }
    });
}

export async function deleteUserCartByUsercartid(userId: string, userCartId: number) {
    return await prisma.user_cart.updateMany({
        where: {
            user_cart_id: userCartId,
            user_id: userId
        },
        data: {
            flag: String(UserCartDbFlag.DELETED)
        }
    });
}

export async function editUserCartByUserAndUserCartId(userId: string, cuisineId: number, quantity: number) {
    const cart = await prisma.user_cart.findFirst({
        where: {
            cuisine_id: cuisineId,
            user_id: userId
        }
    });

    if (!cart) {
        return;
    }

    const finalPrice = quantity * cart.price_per_item;

    return await prisma.user_cart.updateMany({
        where: {
            cuisine_id: Number(cuisineId),
            user_id: userId
        },
        data: {
            quantity: quantity,
            final_price: finalPrice
        }
    });
}

export async function writeToOrder(flag: OrderDbFlag, firstName: string, lastName: string, streetAddress: string, secondAddress: string, city: string, state: string, zipCode: string, phoneNumber: string, emailAddress: string, additionalInfo: string): Promise<any> {
    const result = await prisma.user_order.create({
        data: {
            flag: String(flag),
            created_date: new Date(),
            first_name: firstName,
            last_name: lastName,
            street_address: streetAddress,
            second_address: secondAddress,
            city: city,
            state: state,
            zip_code: zipCode,
            phone_number: phoneNumber,
            email_address: emailAddress,
            additional_info: additionalInfo
        },
        select: {
            user_order_id: true
        }
    });

    return result.user_order_id;
}

export async function updateUserCartFlagIsCooking(sqlString: string): Promise<any> {
    return await prisma.$executeRawUnsafe(sqlString);
}

export async function countUserOrders(userId: string): Promise<number> {
    return await prisma.user_order.count({
        where: {
            user_cart: {
                some: {
                    user_id: userId
                }
            }
        }
    });
}

export async function fetchUserOrders(userId: string): Promise<MyOrderAndCartDb[]> {
    const orders = await prisma.user_order.findMany({
        where: {
            user_cart: {
                some: {
                    user_id: userId
                }
            }
        },
        include: {
            user_cart: {
                where: {
                    user_id: userId
                }
            }
        }
    });

    const result: MyOrderAndCartDb[] = [];
    orders.forEach((order) => {
        order.user_cart.forEach((cart) => {
            result.push({
                user_order_id: order.user_order_id,
                flag_order: Number(order.flag),

                created_date: order.created_date!,
                cooked_date: order.cooked_date!,
                shipped_date: order.shipped_date!,
                delivered_date: order.delivered_date!,
                cancelled_date: order.cancelled_date!,

                first_name: order.first_name!,
                last_name: order.last_name!,
                street_address: order.street_address!,
                second_address: order.second_address!,
                city: order.city!,
                state: order.state!,
                zip_code: order.zip_code!,
                phone_number: order.phone_number!,
                email_address: order.email_address!,
                additional_info: order.additional_info!,

                user_cart_id: cart.user_cart_id,
                user_id: cart.user_id,
                price_per_item: cart.price_per_item,
                quantity: cart.quantity,
                final_price: cart.final_price,
                options: cart.options,
                flag_cart: cart.flag,
                cuisine_id: String(cart.cuisine_id),
                cuisine_name: cart.cuisine_name,
            });
        });
    });

    return result;
}

export async function countAllOrdersPage(): Promise<number> {
    return await prisma.user_order.count();
}

export async function fetchAllOrdersIdPage(limit: number, offset: number): Promise<OrderIdUserOrderDb[]> {
    const orders = await prisma.user_order.findMany({
        orderBy: {
            created_date: 'desc'
        },
        skip: offset,
        take: limit,
        select: {
            user_order_id: true
        }
    });

    return orders.map((order) => ({
        orderid: order.user_order_id
    }));
}

export async function fetchUserOrdesByids(ids: number[]): Promise<AllUserOrderDb[]> {
    const orders = await prisma.user_order.findMany({
        where: {
            user_order_id: {
                in: ids
            }
        },
        select: {
            user_order_id: true,
            flag: true,
            created_date: true,
            cooked_date: true,
            shipped_date: true,
            delivered_date: true,
            cancelled_date: true,
            first_name: true,
            last_name: true,
            street_address: true
        }
    });

    return orders.map((order) => ({
        user_order_id: order.user_order_id,
        flag_order: Number(order.flag),

        created_date: order.created_date!,
        cooked_date: order.cooked_date!,
        shipped_date: order.shipped_date!,
        delivered_date: order.delivered_date!,
        cancelled_date: order.cancelled_date!,

        first_name: order.first_name!,
        last_name: order.last_name!,
        street_address: order.street_address!
    }));
}

export async function fetchUserCartByids(ids: number[]): Promise<UserCartDb[]> {
    return await prisma.user_cart.findMany({
        where: {
            user_order_id: {
                in: ids
            }
        }
    });
}

export async function fetchUserOrdersIdByFlag(flag: OrderDbFlag): Promise<OrderIdUserOrderDb[]> {
    const orders = await prisma.user_order.findMany({
        where: {
            flag: String(flag)
        },
        select: {
            user_order_id: true
        }
    });

    return orders.map((order) => ({
        orderid: order.user_order_id
    }));
}

export async function updateUserOrderCookeddateByIds(ids: number[]): Promise<void> {
    await prisma.user_order.updateMany({
        where: {
            user_order_id: {
                in: ids
            }
        },
        data: {
            cooked_date: new Date(),
            flag: String(OrderDbFlag.COOKED)
        }
    });
}

export async function updateUserOrderShippeddateByIds(ids: number[]): Promise<void> {
    await prisma.user_order.updateMany({
        where: {
            user_order_id: {
                in: ids
            }
        },
        data: {
            shipped_date: new Date(),
            flag: String(OrderDbFlag.SHIPPED)
        }
    });
}

export async function updateUserOrderDelivereddateByIds(ids: number[]): Promise<void> {
    await prisma.user_order.updateMany({
        where: {
            user_order_id: {
                in: ids
            }
        },
        data: {
            delivered_date: new Date(),
            flag: String(OrderDbFlag.RECEIVED)
        }
    });
}

export async function writeToUserChatMain(userId: string, role: string, messageType: string, message: string): Promise<string> {
    const result = await prisma.user_chat_main.create({
        data: {
            user_id: userId,
            message_type: messageType,
            message: message,
            role: role,
            created_date: new Date()
        },
        select: {
            user_chat_main_id: true
        }
    });

    return String(result.user_chat_main_id);
}

export async function writeToLlmresults(input: string, output: string) {
    if (process.env.SF_EMBEDDING_WRITE) {
        const embedding = await generateEmbedding(input);
        await prisma.$executeRaw`
            INSERT INTO llm_results ("llm_input", "llm_output", "llm_input_embedding", "created_date")
            VALUES ( ${input}, ${output}, ${`[${embedding.join(",")}]`}::vector, NOW() )
        `;
    }
}

export async function findSimilarityOnLlmresultsByEmbedding(embedding: number[]): Promise<SimilarEmbedding | null> {
    const vector = `[${embedding.join(",")}]`;
    const results = await prisma.$queryRaw<SimilarEmbedding[]>`
        SELECT
            llm_output as llmouput,
            1 - ( llm_input_embedding <=> ${vector}::vector ) AS similarity
        FROM llm_results
        WHERE llm_input_embedding IS NOT NULL
            AND llm_output IS NOT NULL
        ORDER BY llm_input_embedding <=> ${vector}::vector
        LIMIT 1
    `;
    return results[0] ?? null;
}

export async function fetchChatHistories(userId: string): Promise<UserChatMainDb[]> {
    return await prisma.user_chat_main.findMany({
        where: {
            user_id: userId
        },
        select: {
            message: true,
            role: true
        }
    });
}
import {
  fetchUserOrdersIdByFlag,
  updateUserOrderCookeddateByIds,
  updateUserOrderDelivereddateByIds,
  updateUserOrderShippeddateByIds
} from "@/src/lib/database/database";
import { OrderDbFlag, OrderIdUserOrderDb } from "@/src/lib/database/database.definition";

export async function GET() {
  const shippedIds: OrderIdUserOrderDb[] = await fetchUserOrdersIdByFlag(OrderDbFlag.SHIPPED);
  if (shippedIds.length > 0) {
    const ids = shippedIds.map(o => o.orderid);
    await updateUserOrderDelivereddateByIds(ids);
  }

  const cookedIds: OrderIdUserOrderDb[] = await fetchUserOrdersIdByFlag(OrderDbFlag.COOKED);
  if (cookedIds.length > 0) {
    const ids = cookedIds.map(o => o.orderid);
    await updateUserOrderShippeddateByIds(ids);
  }

  const createdIds: OrderIdUserOrderDb[] = await fetchUserOrdersIdByFlag(OrderDbFlag.CREATED);
  if (createdIds.length > 0) {
    const ids = createdIds.map(o => o.orderid);
    await updateUserOrderCookeddateByIds(ids);
  }

  return new Response(JSON.stringify({ hello: "world!" }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
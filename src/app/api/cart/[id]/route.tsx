import { NextResponse } from "next/server";

import { deleteUserCartByUserCartId } from "@/src/lib/service/cart.service";
import { cookiesGetUserId } from "@/src/lib/util/cookie-util";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: Request, { params }: RouteParams) {
    const userId = await cookiesGetUserId();
    if (!userId) {
        return NextResponse.json({});
    }
    const { id } = await params;
    await deleteUserCartByUserCartId(userId, id);
    return NextResponse.json({});
}
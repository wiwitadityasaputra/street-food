import { NextResponse } from "next/server";

import { deleteUserCartByCuisineId, editUserCartByUserCartId } from "@/src/lib/service/cart.service";
import { cookiesGetUserId } from "@/src/lib/util/cookie-util";
import { countUserCartByUserAndFlag } from "@/src/lib/database/database";
import { UserCartDbFlag } from "@/src/lib/database/database.definition";
import { EditCartResponse } from "@/src/lib/route/chat/handle-bot-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export interface UserCartDetailRouteDeleteResponse {
    totalCart?: number;
}

export async function PUT(request: Request, { params }: RouteParams): Promise<NextResponse> {
    const userId = await cookiesGetUserId();
    if (!userId) {
        return NextResponse.json({});
    }
    const { id } = await params;
    const body: EditCartResponse = await request.json();
    await editUserCartByUserCartId(userId, Number(id), body.quantity);
    return NextResponse.json({});
}

export async function DELETE(request: Request, { params }: RouteParams): Promise<NextResponse<UserCartDetailRouteDeleteResponse>> {
    const userId = await cookiesGetUserId();
    if (!userId) {
        return NextResponse.json({});
    }
    const { id } = await params;
    await deleteUserCartByCuisineId(userId, Number(id));
    const totalCart = await countUserCartByUserAndFlag(userId, UserCartDbFlag.ACTIVE);
    return NextResponse.json({ totalCart });
}
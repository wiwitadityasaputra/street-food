import { NextResponse } from "next/server";

import { deleteUserCartByUsercartid, editUserCartByUserCartId } from "@/src/lib/service/cart.service";
import { cookiesGetUserId } from "@/src/lib/util/cookie-util";
import { countUserCartByUserAndFlag } from "@/src/lib/database/database";
import { UserCartDbFlag } from "@/src/lib/database/database.definition";
import type { EditCartResponse } from "@/src/lib/route/chat/handle-bot-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export interface UserCartDetailRouteDeleteResponse {
    totalCart?: number;
}

export async function PUT(request: Request, { params }: RouteParams): Promise<NextResponse> {
    console.log("dbg PUT 01")
    const userId = await cookiesGetUserId();
    if (!userId) {
        return NextResponse.json({}, { status: 401 });
    }
    console.log("dbg PUT 02")
    const { id } = await params;
    const body: EditCartResponse = await request.json();
    if (!Number.isInteger(body.quantity) || body.quantity < 1) {
        return NextResponse.json({}, { status: 400 });
    }
    console.log("dbg PUT 03 ", userId, id, body.quantity)
    const result = await editUserCartByUserCartId(userId, Number(id), body.quantity);
    if (!result?.count) {
        return NextResponse.json({}, { status: 404 });
    }
    return NextResponse.json({});
}

export async function DELETE(request: Request, { params }: RouteParams): Promise<NextResponse<UserCartDetailRouteDeleteResponse>> {
    const userId = await cookiesGetUserId();
    if (!userId) {
        return NextResponse.json({});
    }
    const { id } = await params;
    await deleteUserCartByUsercartid(userId, Number(id));
    const totalCart = await countUserCartByUserAndFlag(userId, UserCartDbFlag.ACTIVE);
    return NextResponse.json({ totalCart });
}
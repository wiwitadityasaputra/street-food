import { NextResponse } from "next/server";

import { deleteUserCartByUserCartId } from "@/src/lib/service/cart.service";
import { cookiesGetUserId } from "@/src/lib/util/cookie-util";
import { countUserCartByUserAndFlag } from "@/src/lib/database/database";
import { UserCartDbFlag } from "@/src/lib/database/database.definition";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export interface UserCartDetailRouteDeleteResponse {
    totalCart?: number;
}


export async function DELETE(request: Request, { params }: RouteParams): Promise<NextResponse<UserCartDetailRouteDeleteResponse>> {
    const userId = await cookiesGetUserId();
    if (!userId) {
        return NextResponse.json({});
    }
    const { id } = await params;
    await deleteUserCartByUserCartId(userId, id);
    const totalCart = await countUserCartByUserAndFlag(userId, UserCartDbFlag.ACTIVE);
    return NextResponse.json({ totalCart });
}
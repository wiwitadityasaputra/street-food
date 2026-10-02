import { Suspense } from 'react';

import "@/src/app/menu/menu.css";
import CusinesList from "@/src/ui/menu/cuisines-list/cuisines-list";
import CuisinesMenu, { DEFAULT_CUISINE } from "@/src/ui/menu/cuisines-menu";
import { ModalSkeleton } from '@/src/ui/menu/modal/modal-skeleton';
import { ModalWrapper } from '@/src/ui/menu/modal/modal-wrapper';
import { CuisinesListSkeleton } from '@/src/ui/menu/cuisines-list/cuisines-list-skeleton';
import { getChatHistories } from "@/src/lib/service/chat.service";
import { UserChatMainFe } from "@/src/lib/database/database.definition";
import { cookiesGet } from '@/src/lib/util/cookie-util';

export default async function Menu(props: {
  searchParams?: Promise<{
    cuisine?: string;
    cuisineId?: string;
  }>;
}) {
    const searchParams = await props.searchParams;
    const cuisineParams = (searchParams?.cuisine) || DEFAULT_CUISINE;
    const cuisineId = searchParams?.cuisineId;

    const cookieData = await cookiesGet();
    const messages: UserChatMainFe[] = await getChatHistories(cookieData.userId)

    return (
        <>
            {!!cuisineId && <Suspense key={cuisineId} fallback={<ModalSkeleton cuisine={cuisineParams} />}>
                <ModalWrapper cuisineId={cuisineId} cuisine={cuisineParams} />
            </Suspense>}
            
            <section className="section-menu">
                <div className="container">
                    <CuisinesMenu messages={messages} />
                    <Suspense key={cuisineParams} fallback={<CuisinesListSkeleton />}>
                        <CusinesList cuisine={cuisineParams} />
                    </Suspense>
                </div>
            </section>
        </>
    );
}
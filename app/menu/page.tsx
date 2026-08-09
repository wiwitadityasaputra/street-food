import { Suspense } from 'react';

import "@/app/menu/menu.css";
import CusinesList from "@/app/ui/menu/cuisines-list/cuisines-list";
import CuisinesMenu, { DEFAULT_CUISINE } from "@/app/ui/menu/cuisines-menu";
import { ModalSkeleton } from '@/app/ui/menu/modal/modal-skeleton';
import { ModalWrapper } from '@/app/ui/menu/modal/modal-wrapper';
import { CuisinesListSkeleton } from '@/app/ui/menu/cuisines-list/cuisines-list-skeleton';

export default async function Menu(props: {
  searchParams?: Promise<{
    cuisine?: string;
    cuisineId?: string;
  }>;
}) {
    const searchParams = await props.searchParams;
    const cuisineParams = (searchParams?.cuisine) || DEFAULT_CUISINE;
    const cuisineId = searchParams?.cuisineId;

    return (
        <>
            {!!cuisineId && <Suspense key={cuisineId} fallback={<ModalSkeleton cuisine={cuisineParams} />}>
                <ModalWrapper cuisineId={cuisineId} cuisine={cuisineParams} />
            </Suspense>}
            
            <section className="section-menu">
                <div className="container">
                    <CuisinesMenu />
                    <Suspense key={cuisineParams} fallback={<CuisinesListSkeleton />}>
                        <CusinesList cuisine={cuisineParams} />
                    </Suspense>
                </div>
            </section>
        </>
    );
}
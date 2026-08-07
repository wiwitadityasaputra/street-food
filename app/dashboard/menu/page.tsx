import { Suspense } from 'react';

import "@/app/dashboard/menu/menu.css";
import FoodList from "@/app/ui/menu/food-list";
import Cuisines, { DEFAULT_CUISINE } from "@/app/ui/menu/cuisines";
import { ModalSkeleton } from '@/app/ui/menu/add-to-cart-modal/modal-skeleton';
import { ModalWrapper } from '@/app/ui/menu/add-to-cart-modal/modal-wrapper';

export default async function Menu(props: {
  searchParams?: Promise<{
    cuisine?: string;
    cuisineId?: string;
    showModal?: string;
  }>;
}) {
    const searchParams = await props.searchParams;
    const cuisineParams = (searchParams?.cuisine) || DEFAULT_CUISINE;
    const cuisineId = searchParams?.cuisineId;
    const showModal = searchParams?.showModal === "true" && cuisineId;

    return (
        <>
            {showModal && <Suspense fallback={<ModalSkeleton />}>
                <ModalWrapper cuisineId={cuisineId} />
            </Suspense>}
            
            <section className="section-menu">
                <div className="container">
                    <Cuisines />
                    <FoodList cuisine={cuisineParams} />
                </div>
            </section>
        </>
    );
}
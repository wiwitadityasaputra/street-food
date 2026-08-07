import { Suspense } from 'react';

import "@/app/dashboard/menu/menu.css";
import FoodList from "@/app/ui/menu/food-list";
import Cuisines, { DEFAULT_CUISINE } from "@/app/ui/menu/cuisines";
import { Modal01Skeleton } from '@/app/ui/menu/add-to-chart-modal/modal01-skeleton';
import { Modal01 } from '@/app/ui/menu/add-to-chart-modal/modal01';

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
            {showModal && <Suspense fallback={<Modal01Skeleton />}>
                <Modal01 cuisineId={cuisineId} />
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
"use client";

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Cuisines } from "@/app/lib/definition";

export default function AddToChartButton({cuisine}: {cuisine: Cuisines}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

    const addToChart = (cuisine: Cuisines) => {
        // 1. Create a mutable copy of existing parameters
        const params = new URLSearchParams(searchParams.toString());
        
        // 2. Set or update the new parameter
        params.set("showModal", "true");
        params.set("cuisineId", String(cuisine.id));
        
        // 3. Update the URL with the combined parameters
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <button className="add_to_cart" onClick={() => addToChart(cuisine)}>
            add to cart
        </button>
    );
}
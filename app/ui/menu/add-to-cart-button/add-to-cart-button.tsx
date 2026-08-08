"use client";

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { AddToCartButtonProps } from './add-to-cart-button.definition';
import { CuisinesDb } from '@/app/lib/database/database.definition';

export default function AddToCartButton(props: AddToCartButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

    const addToCart = (cuisine: CuisinesDb) => {
        // 1. Create a mutable copy of existing parameters
        const params = new URLSearchParams(searchParams.toString());
        
        // 2. Set or update the new parameter
        params.set("cuisineId", String(cuisine.id));
        
        // 3. Update the URL with the combined parameters
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }

    return (
        <button className="add_to_cart" onClick={() => addToCart(props.cuisine)}>
            add to cart
        </button>
    );
}
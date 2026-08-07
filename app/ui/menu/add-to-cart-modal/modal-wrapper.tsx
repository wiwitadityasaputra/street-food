import { fetchCuisineCartByCuisineId, fetchCuisinesById } from "@/app/lib/data";

import { CloseButton } from "./close-btn";
import { ModalContent } from "./modal-content";

export interface ModalWrapperOptions {
    cuisineId: string;
    cuisine: string;
}

export async function ModalWrapper(props: ModalWrapperOptions) {
    const cuisineId = props.cuisineId;
    const cuisineCarts = await fetchCuisineCartByCuisineId(cuisineId);
    const cuisine = await fetchCuisinesById(cuisineId);

    if (!cuisine) {
        return (<div>404 not found.</div>)
    }

    return (
        <div className="add-to-cart-modal modal show cart_popup">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <CloseButton cuisine={props.cuisine} />
                        <ModalContent cuisine={cuisine} cuisineCarts={cuisineCarts} />
                    </div>
                </div>
            </div>
        </div>
    )
}
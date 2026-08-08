import { fetchCuisineCartByCuisineId, fetchCuisinesById } from "@/app/lib/data";

import { CloseButton } from "../close-button/close-btn";
import { ModalContent } from "./modal-content";
import { cookiesGetUserId } from "@/app/lib/cookie-util";
import { ModalWrapperOptions } from "./modal.definition";

export async function ModalWrapper(props: ModalWrapperOptions) {
    const cuisineId = props.cuisineId;
    const cuisineCarts = await fetchCuisineCartByCuisineId(cuisineId);
    const cuisine = await fetchCuisinesById(cuisineId);
    const userId = await cookiesGetUserId();

    if (!cuisine) {
        return (<div className="add-to-cart-modal modal show cart_popup">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <CloseButton cuisine={props.cuisine} />
                        not found
                    </div>
                </div>
            </div>
        </div>)
    }

    return (
        <div className="add-to-cart-modal modal show cart_popup">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <CloseButton cuisine={props.cuisine} />
                        <ModalContent cuisine={cuisine} cuisineCarts={cuisineCarts} userId={userId} />
                    </div>
                </div>
            </div>
        </div>
    )
}
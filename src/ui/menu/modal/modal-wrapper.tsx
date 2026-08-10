import { CloseButton } from "@/src/ui/menu/close-button/close-btn";
import { ModalContent } from "@/src/ui/menu/modal/modal-content";
import { cookiesGetUserId } from "@/src/lib/util/cookie-util";
import { ModalWrapperOptions } from "@/src/ui/menu/modal/modal.definition";
import { fetchCuisineCartByCuisineId, fetchCuisinesById } from "@/src/lib/database/database";

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
import { fetchCuisineCartByCuisineId, fetchCuisinesById } from "@/app/lib/data";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { CloseButton } from "./close-btn";
import { ModalContent } from "./modal-content";

export interface ModalWrapperOptions {
    cuisineId: string;
}

export async function ModalWrapper(props: ModalWrapperOptions) {
    const cuisineId = props.cuisineId;
    const cuisineCarts = await fetchCuisineCartByCuisineId(cuisineId);
    const cuisine = await fetchCuisinesById(cuisineId);

    if (!cuisine) {
        return (<div>404 not found.</div>)
    }

    return (
        <div className="add-to-chart-modal modal show cart_popup">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <CloseButton />
                        <ModalContent cuisine={cuisine} cuisineCarts={cuisineCarts} />
                    </div>
                </div>
            </div>
        </div>
    )
}
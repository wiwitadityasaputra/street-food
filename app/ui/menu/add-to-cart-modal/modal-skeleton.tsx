import "@/app/ui/menu/add-to-cart-modal/add-to-cart-modal.css"

import { CloseButton } from "./close-btn";

export async function ModalSkeleton() {
    return (<>
        <div className="add-to-cart-modal modal show cart_popup">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <CloseButton />
                        please wait...
                    </div>
                </div>
            </div>
        </div>
    </>);
}
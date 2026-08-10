import "@/src/ui/menu/modal/modal.css";

import { CloseButton } from "@/src/ui/menu/close-button/close-btn";
import { ModalSkeletonProps } from "@/src/ui/menu/modal/modal.definition";

export async function ModalSkeleton(props: ModalSkeletonProps) {
    return (<>
        <div className="add-to-cart-modal modal show cart_popup">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <CloseButton cuisine={props.cuisine} />
                        please wait...
                    </div>
                </div>
            </div>
        </div>
    </>);
}
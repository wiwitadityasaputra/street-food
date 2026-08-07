import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { closeAddToCartModal } from "@/app/lib/actions";

export function CloseButton() {
    return (<>
        <form action={closeAddToCartModal}>
            <button type="submit" className="btn-close">
                <FontAwesomeIcon icon={faClose} size="sm" />
            </button>
        </form>    
    </>);
}
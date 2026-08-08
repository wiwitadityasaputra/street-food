import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { closeAddToCartModal } from "@/app/lib/form-action/menu.action";
import { CloseButtonProps } from "./close-btn.definition";

export async function CloseButton(props: CloseButtonProps) {

    const formAction = closeAddToCartModal.bind(null, props.cuisine);
    return (<>
        <form action={formAction}>
            <button type="submit" className="btn-close">
                <FontAwesomeIcon icon={faClose} size="sm" />
            </button>
        </form>    
    </>);
}
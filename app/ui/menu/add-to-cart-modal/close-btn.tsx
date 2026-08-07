import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { closeAddToCartModal } from "@/app/lib/actions";

export interface CloseButtonProps {
    cuisine: string;
}

export async function CloseButton(props: CloseButtonProps) {


    console.log("dbg props ", props)

    const formAction = closeAddToCartModal.bind(null, props.cuisine);
    return (<>
        <form action={formAction}>
            <button type="submit" className="btn-close">
                <FontAwesomeIcon icon={faClose} size="sm" />
            </button>
        </form>    
    </>);
}
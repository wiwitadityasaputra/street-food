
import "@/src/ui/queue/user-info/user-info.css";
import { UserInfoProps } from "@/src/ui/queue/user-info/user-info.definition";

export function UserInfo(props: UserInfoProps) {
    return (<>
        <h5 className="user-info user-name">
            {props.orderId}. {props.firstName} {props.lastName}
        </h5>
        <h6 className="user-info user-address">Street Address</h6>
        <p className="user-info user-address-value">{props.streetAddress}</p>
    </>);
}
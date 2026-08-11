import { UserInfoProps } from "@/src/ui/queue/user-info/user-info.definition";

export function UserInfo(props: UserInfoProps) {
    return (<>
        <h5 className="user-name">
            {props.orderId}. {props.firstName} {props.lastName}
        </h5>
        <h6 className="user-address">Street Address</h6>
        <p className="user-address-value">{props.streetAddress}</p>
    </>);
}
export interface QueueMenuProps {
    userTotalOrder: number;

    totalOrders: number;
}
export const MENU_ME_HREF = "/queue/me";
export const MENU = [
    {
        name: "My Orders",
        href: MENU_ME_HREF,
        className: "my-button"
    }, {
        name: "All Orders",
        href: "/queue/all",
        className: "all-button"
    }
];

export const ALLOWED_SIZE = [5, 10, 15, 25];
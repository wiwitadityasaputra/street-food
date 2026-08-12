export interface QueueMenuProps {
    userTotalOrder: number;

    totalOrders: number;
}
export const MENU_ME_HREF = "/queue/me";
export const MENU = [
    {
        key: "1",
        name: "My Orders",
        nameShort: "My",
        href: MENU_ME_HREF,
        className: "my-button"
    },
    {
        key: "2",
        name: "All Orders",
        nameShort: "All",
        href: "/queue/all",
        className: "all-button"
    }
];

export const ALLOWED_SIZE = [5, 10, 15, 25];
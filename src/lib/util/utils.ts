import { OrderDbFlag } from "../database/database.definition";
import { USER_CART_OPTIONS_SEPARATOR } from "../service/service.definition";

export const SIMILARITY_THRESHOLD = 0.95;
export const DEEPSEEK_MODEL = "deepseek-flash";

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDate = (date?: Date) => {
  if (!date) {
    return "-";
  }
  return date.toLocaleDateString('en-US', {
    weekday: "short",
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export const orderFlagToStatus = (flag: number) => {
    const flagN = Number(flag);
    if (flagN === OrderDbFlag.CREATED) {
        return "Order placed";
    } else if (flagN === OrderDbFlag.COOKED) {
        return "Cooked";
    } else if (flagN === OrderDbFlag.SHIPPED) {
        return "Shipped";
    } else if (flagN === OrderDbFlag.RECEIVED) {
        return "Received";
    } else if (flagN === OrderDbFlag.CANCELLED) {
        return "Cancelled";
    }
    return "-";
}

export const maskingValue = (value: string) => {
  let result = "";
  for(let i = 0; i < value.length; i++) {
    result += "*";
  }
  return result;
}

export const cartOptionsToReadable = (cuisineName: string, finalPrice: number, index?: number, options?: string) => {
  let opts = undefined;
  if (options) {
    opts = `- ${options.split(USER_CART_OPTIONS_SEPARATOR).join(", ")}`;
  }
  return `${index ? (index + '.') : ''} ${cuisineName} - ${formatCurrency(finalPrice)} ${opts ? opts : ''}`;
}
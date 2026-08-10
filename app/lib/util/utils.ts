import { OrderDbFlag } from "../database/database.definition";

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
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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
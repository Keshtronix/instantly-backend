import {
  FREE_DELIVERY_THRESHOLD,
  DELIVERY_FEE,
  TAX_RATE,
} from "../constants/constant";

type CartTotalsItem = {
  productId: {
    salePrice: number;
    [key: string]: unknown;
  };
  quantity: number;
};

export const calculateCartTotals = (
  items: CartTotalsItem[],
  discountAmount: number = 0
) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.productId?.salePrice ?? 0) * item.quantity;
  }, 0);

  const roundedSubtotal = Math.round(subtotal * 100) / 100;
  const deliveryFee =
    roundedSubtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const tax = Math.round(roundedSubtotal * TAX_RATE * 100) / 100;

  const roundedDiscount = Math.round(discountAmount * 100) / 100;

  const orderTotal = Math.max(
    Math.round((roundedSubtotal + deliveryFee + tax - roundedDiscount) * 100) / 100,
    0
  );

  return {
    subtotal: roundedSubtotal,
    deliveryFee,
    tax,
    discountAmount: roundedDiscount,
    orderTotal,
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
  };
};
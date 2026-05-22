import { formatProductPrice } from '../../catalog/utils/catalog-price.util';

export const formatCartLineTotal = (amount: number): string => formatProductPrice(amount);

export const formatCartGrandTotal = (amount: number): string => formatProductPrice(amount);

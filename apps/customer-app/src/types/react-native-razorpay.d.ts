declare module 'react-native-razorpay' {
  export type RazorpayOpenOptions = {
    key: string;
    amount: number;
    currency: string;
    order_id: string;
    name?: string;
    description?: string;
    prefill?: {
      email?: string;
      contact?: string;
      name?: string;
    };
  };

  export type RazorpaySuccessData = {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  };

  export type RazorpayErrorData = {
    code?: number;
    description?: string;
  };

  const RazorpayCheckout: {
    open(options: RazorpayOpenOptions): Promise<RazorpaySuccessData>;
  };

  export default RazorpayCheckout;
}

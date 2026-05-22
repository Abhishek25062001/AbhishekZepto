export type RazorpayCreateOrderInput = {
  amountPaise: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
};

export type RazorpayCreateOrderResult = {
  id: string;
  amount: number;
  currency: string;
};

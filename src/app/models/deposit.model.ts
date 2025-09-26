export interface Deposit {
  amount: number;
  largeString: string;
  depositMethod: 'contact' | 'automatic';
  automaticDepositDateChoice?: 'immediate' | 'other';
  paymentMethod?: string;
  otherDate?: Date | null;
}

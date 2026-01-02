
export enum JobType {
  SINGLE = "Satu pesanan satu produk total satu pesanan",
  TRIPLE = "Satu pesanan tiga produk total tiga pesanan"
}

export interface TaskData {
  phoneNumber: string;
  jobType: JobType;
  productPrice: number;
  commissionRate: number;
  commissionAmount: number;
  totalAmount: number;
  generatedAt: string;
}

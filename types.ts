
export enum JobType {
  SINGLE = "Satu pesanan satu produk total satu pesanan",
  TRIPLE = "Satu pesanan tiga produk total tiga pesanan",
  QUAD =  "Satu pesanan empat produk total empat pesanan",
  PENTA = "Satu pesanan lima produk total lima pesanan"
}

export interface TaskData {
  phoneNumber: string;
  jobType: JobType;
  productPrice: number;
  generatedAt: string;
}

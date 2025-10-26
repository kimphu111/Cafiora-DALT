export interface orderModel {
  id: string;
  tableNumber: number;
  employeeId: string ;
  status: boolean;
  note: string;
  createdAt?: string;
  updatedAt?: string;
}
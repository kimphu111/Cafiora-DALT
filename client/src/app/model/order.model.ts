export interface orderModel {
  id: string;
  tableNumber: number;
  employeeId: string ;
  status: boolean;
  note: string;
  createAt?: string;
  updateAt?: string;
}
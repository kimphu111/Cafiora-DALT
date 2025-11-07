import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, forkJoin, map, Observable, of, switchMap } from "rxjs";
import { OrderDetailModel, OrderModel } from "../model/order.model";

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  private baseUrl = 'http://localhost:8000/api/barista';
  private http = inject(HttpClient);

  getAllOrders(): Observable<any[]> {
    return this.http.get<{data: any}>(`${this.baseUrl}/getAllOrders`)
    .pipe(
      map(res => res.data.map((order: any): OrderModel => ({
        orderId: order.order_id,
        tableNumber: order.table_number,
        customerName: order.customer_name || 'Customer Name',
         employee: {
          employeeId: order.employee._id,
          username: order.employee.username,
          email: order.employee.email,
        },
        status: order.status,
        note: order.note || 'No',
        orderDetailId: order.orderDetail_id,
        createdAt: order.createdAt,
        // updatedAt: order.updatedAt
      })))
    );
  }

  getOrderDetail(orderDetailId: string): Observable<OrderDetailModel[]> {
    return this.http.get<{data: any}>(`${this.baseUrl}/getOrderDetail/${orderDetailId}`)
    .pipe(
      map(res => {
        if (res.data) {
          const orderDetail = res.data;
          return [{
            orderDetailId: orderDetail._id,
            orderId: orderDetail.order_id,
            items: orderDetail.items.map((item: any) => ({
              productId: item.product_id,
              quantity: item.quantity,
              subtotal: item.subtotal,
              unitPrice: item.unit_price,
              someoneId: item._id,
            })),
          createdAt: orderDetail.createdAt,
          updatedAt: orderDetail.updatedAt,
          }]
        } else {
          console.error('No order details found.');
          return [];
        }
      }),
      catchError(error => {
        console.error('Error fetching order detail:', error);
      return of([]);
      })
    );
  }

  getAllOrdersWithDetails(): Observable<OrderModel[]> {
    return this.getAllOrders().pipe(
      switchMap(orders => {
        if (!orders.length) {
          return of([]);
        }

        // Tạo mảng Observable của các request chi tiết đơn hàng
        const orderDetailsRequests = orders.map(order =>
          this.getOrderDetail(order.orderDetailId)
        );

        // Chạy tất cả request song song và gán kết quả vào orders
        return forkJoin(orderDetailsRequests).pipe(
          map(details => 
            orders.map((order, index) => ({
              ...order,
              orderDetails: details[index]
            }))
          )
        );
      })
    );
  }
  
}
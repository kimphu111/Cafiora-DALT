import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, forkJoin, map, Observable, of } from "rxjs";
import { OrderDetailModel, OrderModel } from "../model/order.model";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:8000/api/barista';
  private http = inject(HttpClient);

  private createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllOrders(): Observable<any[]> {
    const headers = this.createAuthHeaders();

    return this.http.get<{ data: any }>(`${this.baseUrl}/getAllOrders`, {
      headers,
      withCredentials: true
    }).pipe(
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
      })))
    );
  }

  getOrderDetail(orderDetailId: string): Observable<OrderDetailModel[]> {
    const headers = this.createAuthHeaders();

    return this.http.get<{ data: any }>(`${this.baseUrl}/getOrderDetail/${orderDetailId}`, {
      headers,
      withCredentials: true
    }).pipe(
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
              header: []
            })),
            createdAt: orderDetail.createdAt,
            updatedAt: orderDetail.updatedAt,
          }];
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
    return new Observable<OrderModel[]>((observer) => {
      this.getAllOrders().subscribe({
        next: orders => {
          const orderDetailsRequests = orders.map(order => this.getOrderDetail(order.orderDetailId));

          forkJoin(orderDetailsRequests).subscribe({
            next: details => {
              orders.forEach((order, index) => {
                order.orderDetails = details[index];
              });
              observer.next(orders);
            },
            error: err => observer.error(err),
          });
        },
        error: err => observer.error(err),
      });
    });
  }
}

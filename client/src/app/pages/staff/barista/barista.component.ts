import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { orderModel } from '../../../model/order.model';
import { map } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-barista',
  imports: [RouterLink, DatePipe],
  templateUrl: './barista.component.html',
  styleUrl: './barista.component.scss'
})
export class BaristaComponent implements OnInit {
  private http = inject(HttpClient);
  orders: orderModel[] = [];

  ngOnInit(): void {
    // console.log('OnInit');
    this.fetchOrderData();
  }

  fetchOrderData() {
    this.http.get<orderModel[]>('http://localhost:8000/api/barista/getAllOrders')
    .pipe(
      map(res => res.map((order: any): orderModel => ({
        id: order._id,
        tableNumber: order.table_number,
        employeeId: order.employee_id,
        status: order.status,
        note: order.note,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      })) )
    )
    .subscribe({
      next: (res) => {
        this.orders = res || [];
        console.log(res);
        // console.log(this.orders);
        console.log(this.orders.map(o => o.createdAt));
      },
      error: (err) => {
        console.error('Failed to fetch orders', err);
      }
    });
  }

  updateOrderStatus(orderId: string) {
    if (!orderId) return;
    this.orders = this.orders.map(o =>
      o.id === orderId ? { ...o, status: true } : o
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { orderModel } from '../../../model/order.model';

@Component({
  selector: 'app-barista',
  imports: [RouterLink],
  templateUrl: './barista.component.html',
  styleUrl: './barista.component.scss'
})
export class BaristaComponent implements OnInit {
  private http = inject(HttpClient);
  orders: orderModel[] = [];

  ngOnInit(): void {
    this.fetchOrderData();
  }

  fetchOrderData() {
    this.http.get<orderModel[]>('http://localhost:8000/api/barista/getAllOrders').subscribe({
      next: (res) => {
        this.orders = res || [];
        console.log(res);
      },
      error: (err) => {
        console.error('Failed to fetch orders', err);
      }
    });
  }
}

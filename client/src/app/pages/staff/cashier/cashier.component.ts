import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";
import { OrderService } from '../../../services/order.service';
import { OrderModel } from '../../../model/order.model';

@Component({
  selector: 'app-cashier',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './cashier.component.html',
  styleUrl: './cashier.component.scss'
})
export class CashierComponent {
}

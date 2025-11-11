import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { OrderDetailModel, OrderModel } from '../../../model/order.model';
import { forkJoin, map, Observable } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-barista',
  imports: [RouterLink, DatePipe, CommonModule, RouterLinkActive],
  templateUrl: './barista.component.html',
  styleUrl: './barista.component.scss'
})
export class BaristaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  private orderService = inject(OrderService);

  orders: OrderModel[] = [];
  status = signal<'new' | 'completed'>('new');
  currentTab: string = 'new'; 
  
  tableRows: Array<{
    orderId: string;
    createdAt: number;
    tableNumber: number;
    status: boolean;
    customerName: string;
    note: string;
    quantity: number;
    productId: string;
    productName: string;
    rowKey: string;
  }> = [];

  constructor() {
    this.route.paramMap.subscribe(params => {
      const param = (params.get('status') as 'new' | 'completed') || 'new';
      this.status.set(param);
    });
  }

  ngOnInit(): void {
    this.getOrderDetailId();
    this.loadOrdersWithDetails();
    this.getDetail('69058f5d0d8233402768ab4f');
  }

  getDetail(id: string) {
    this.http.get(`http://localhost:8000/api/barista/getOrderDetail/${id}`).subscribe({next: res => console.log(res)})
  }

  toggleMode() {
    const next = this.status() === 'new' ? 'completed' : 'new';
    this.router.navigate(['/barista', next]);
  }

  getOrderDetailId() {
    this.orderService.getAllOrders().subscribe({
      next: res => {
        if (res && Array.isArray(res)) {
          const orderDetailIds = res.map(order => order.orderDetailId);
          console.log(orderDetailIds);
          const orderDetailRequests = orderDetailIds.map(id => this.orderService.getOrderDetail(id));

          forkJoin(orderDetailRequests).subscribe({
            next: orderDetails => {
              console.log(orderDetails);
            },
            error: (err) => {
            console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
          }
          })
        }

      },
      error: (err) => console.error('Lỗi khi lấy dữ liệu đơn hàng:', err)
    })
  }

  loadOrdersWithDetails(): void {
    this.orderService.getAllOrdersWithDetails().subscribe({
      next: (orders: any[]) => {
        this.orders = orders;
        this.buildTableRows(orders);
      },
      error: (err) => {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
      }
    });
  }

  // Helper: lấy id/name (và có thể cả price/image) từ item.productId (string hoặc object)
  private resolveItemProduct(item: any): { id: string; name: string } {
    const prod = item?.productId ?? item?.product_id;
    // debug khi cấu trúc không như mong đợi
    if (!prod) {
      // console.warn('resolveItemProduct: missing product for item', item);
      return { id: '', name: '' };
    }
    if (typeof prod === 'string') {
      // nếu chỉ có id, trả id và để name rỗng (có thể fetch sau nếu cần)
      return { id: prod, name: '' };
    }
    // support nhiều tên trường khác nhau
    const name = prod.nameProduct ?? prod.productName ?? prod.name ?? '';
    if (!name) console.warn('resolveItemProduct: product object has no name field', prod);
    return {
      id: prod._id ?? prod.id ?? '',
      name
    };
  }

   private buildTableRows(orders: any[]) {
    this.tableRows = orders.flatMap(order =>
      (order?.orderDetails ?? []).flatMap((detail: any, detailIndex: number) =>
        (detail?.items ?? []).map((item: any, itemIndex: number) => {
          const p = this.resolveItemProduct(item);
          const rowKey = `${order.orderId}-${p.id || 'no-id'}-${detailIndex}-${itemIndex}`;
          return {
            orderId: order.orderId,
            createdAt: order.createdAt ?? '',
            tableNumber: order.tableNumber,
            status: order.status,
            customerName: order.customerName,
            note: order.note,
            quantity: item.quantity,
            productId: p.id,
            productName: p.name,
            rowKey
          };
        })
      )
    );
  }

  get filteredTableRows() {
    const targetStatus = this.status() === 'completed';
    return this.tableRows.filter(row => row.status === targetStatus);
  }

  // dùng rowKey để cập nhật local state cho chắc
  markDone(row: any) {
    if (!row?.rowKey) {
      console.warn('markDone: missing rowKey, cannot update reliably', row);
      return;
    }
    const i = this.tableRows.findIndex(r => r.rowKey === row.rowKey);
    if (i === -1) {
      console.warn('markDone: row not found for rowKey', row.rowKey);
      return;
    }
    this.tableRows[i] = { ...this.tableRows[i], status: true };
    console.log('Marked done (local):', this.tableRows[i]);
  }

  // helper debug: log tất cả items không có productName
  logMissingProductNames() {
    const misses = this.tableRows.filter(r => !r.productName);
    console.log('items missing productName:', misses);
  }

  
}

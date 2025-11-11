import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from "@angular/forms";

interface Product {
  _id: string;
  nameProduct: string;
  price: number;
  status: boolean;
  urlImage: string;
}

interface TableCart {
  cart: { product: Product; quantity: number }[];
  note: string;
  customerName: string;
}

@Component({
  selector: 'app-waiter',
  imports: [CommonModule, DecimalPipe, FormsModule],
  templateUrl: './waiter.component.html',
  styleUrls: ['./waiter.component.scss']
})
export class WaiterComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error = '';

  tables = [1,2,3,4,5,6,7,8];
  tableStatus: { [key: number]: boolean } = {};
  selectedTable: number | null = null;
  currentOrderId: string | null = null;

  cartByTable: { [table: number]: TableCart } = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const savedTableStatus = localStorage.getItem('tableStatus');
    this.tableStatus = savedTableStatus ? JSON.parse(savedTableStatus) : {};
    this.tables.forEach(t => {
      if (!(t in this.tableStatus)) this.tableStatus[t] = false;
    });

    const savedCartByTable = localStorage.getItem('cartByTable');
    this.cartByTable = savedCartByTable ? JSON.parse(savedCartByTable) : {};

    this.getProducts();
  }

  getProducts() {
    this.loading = true;
    this.http.get<any>('http://localhost:8000/api/getProduct').subscribe({
      next: (res) => { this.products = res.dataProduct || []; this.loading = false; },
      error: (err) => { console.error(err); this.error='Không thể tải sản phẩm'; this.loading=false; }
    });
  }

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/no-image.png';
  }


  get cart() {
    if (!this.selectedTable) return [];
    return this.cartByTable[this.selectedTable]?.cart || [];
  }

  set cart(val: { product: Product; quantity: number }[]) {
    if (!this.selectedTable) return;
    this.cartByTable[this.selectedTable].cart = val;
    this.saveLocal();
  }

  get note() {
    if (!this.selectedTable) return '';
    return this.cartByTable[this.selectedTable].note;
  }

  set note(val: string) {
    if (!this.selectedTable) return;
    this.cartByTable[this.selectedTable].note = val;
    this.saveLocal();
  }

  get customerName() {
    if (!this.selectedTable) return '';
    return this.cartByTable[this.selectedTable].customerName;
  }

  set customerName(val: string) {
    if (!this.selectedTable) return;
    this.cartByTable[this.selectedTable].customerName = val;
    this.saveLocal();
  }

  selectProduct(product: Product) {
    const existing = this.cart.find(i => i.product._id === product._id);
    if (existing) existing.quantity++;
    else this.cart = [...this.cart, { product, quantity: 1 }];
  }

  increaseQuantity(item: any) {
    item.quantity++;
    this.cart = [...this.cart];
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) item.quantity--;
    else this.cart = this.cart.filter(i => i.product._id !== item.product._id);
  }

  get totalItems() {
    return this.cart.reduce((sum, i) => sum + i.quantity, 0);
  }

  get totalPrice() {
    return this.cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }

  saveLocal() {
    localStorage.setItem('cartByTable', JSON.stringify(this.cartByTable));
    localStorage.setItem('tableStatus', JSON.stringify(this.tableStatus));
  }

  submitOrder() {
    if (!this.cart.length || !this.selectedTable) {
      alert('Chọn bàn và thêm sản phẩm!');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) { alert('Bạn cần đăng nhập!'); return; }

    const payload = {
      table_number: this.selectedTable,
      note: this.note,
      customer_name: this.customerName,
      items: this.cart.map(i => ({ product_id: i.product._id, quantity: i.quantity, unit_price: i.product.price }))
    };

    this.http.post('http://localhost:8000/api/waiter/createOrder', payload, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        alert(res.message || 'Đặt đơn thành công!');
        this.selectedTable = null;
        this.currentOrderId = null;
      },
      error: (err) => { console.error(err); alert('Lỗi tạo đơn'); }
    });
  }

  async selectTable(t: number) {
    if (this.tableStatus[t]) {
      // Bàn đã có khách
      const action = await this.confirmPopup(
        `Bàn ${t} đã có khách. Nhấn OK để xóa bàn hoặc Hủy để xem order cũ.`,
        t
      );

      if (action) {
        // Xóa bàn
        this.tableStatus[t] = false;
        this.cartByTable[t] = { cart: [], note: '', customerName: '' };
        if (this.selectedTable === t) this.selectedTable = null;
        this.saveLocal();
      } else {
        this.selectedTable = t;
        this.loadExistingOrder(t);
      }
    } else {
      if (this.selectedTable && this.selectedTable !== t) {
        alert(`Bạn đang thao tác bàn ${this.selectedTable}. Hủy bàn trước khi sang bàn khác.`);
        return;
      }

      // Chọn bàn mới để tạo order
      this.selectedTable = t;
      this.cartByTable[t] = { cart: [], note: '', customerName: '' };
      this.tableStatus[t] = true;
      this.saveLocal();
    }
  }

  loadExistingOrder(tableNumber: number) {
    const token = localStorage.getItem('accessToken') || '';
    this.http.get(`http://localhost:8000/api/waiter/getOrderByTable/${tableNumber}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        this.cartByTable[tableNumber] = {
          cart: res.items.map((i: any) => ({
            product: { _id: i.product_id, nameProduct: i.name, price: i.unit_price, urlImage: i.urlImage, status: true },
            quantity: i.quantity
          })),
          note: res.note || '',
          customerName: res.customer_name
        };
        this.saveLocal();
      },
      error: (err) => console.error('Lỗi lấy order', err)
    });
  }

  resetCurrentTable() {
    if (!this.selectedTable) return;
    this.selectedTable = null;
    this.saveLocal();
  }




  // popup variables
  showConfirmPopup = false;
  popupTableNumber: number | null = null;
  popupMessage = '';
  popupResolve: ((action: boolean) => void) | null = null;

  confirmPopup(message: string, tableNumber: number): Promise<boolean> {
    this.popupMessage = message;
    this.popupTableNumber = tableNumber;
    this.showConfirmPopup = true;

    return new Promise(resolve => {
      this.popupResolve = resolve;
    });
  }

  onPopupOk() {
    if (this.popupResolve && this.popupTableNumber !== null) {
      this.popupResolve(true);
    }
    this.closePopup();
  }

  onPopupCancel() {
    if (this.popupResolve && this.popupTableNumber !== null) {
      this.popupResolve(false);
    }
    this.closePopup();
  }
  closePopup() {
    this.showConfirmPopup = false;
    this.popupTableNumber = null;
    this.popupMessage = '';
    this.popupResolve = null;
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Product {
  _id: string;
  nameProduct: string;
  price: number;
  urlImage: string;
}

@Component({
  selector: 'app-edit-drinks',
  templateUrl: './edit-drinks.component.html',
  styleUrls: ['./edit-drinks.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class EditDrinksComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;

  // Form data
  formData = {
    nameProduct: '',
    price: '',
    image: null
  };
  previewImage: string | ArrayBuffer | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProducts();
  }

  // Load danh sách đồ uống
  loadProducts() {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<{ dataProduct: Product[] }>('http://localhost:8000/api/getProduct', { headers })
      .subscribe(res => this.products = res.dataProduct, err => console.error(err));
  }

  // Chọn ảnh
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.formData.image = file;
      const reader = new FileReader();
      reader.onload = () => this.previewImage = reader.result;
      reader.readAsDataURL(file);
    }
  }

  // Chọn sản phẩm từ danh sách bên trái
  selectProduct(product: Product) {
    this.selectedProduct = product;
    this.formData.nameProduct = product.nameProduct;
    this.formData.price = product.price.toString();
    this.previewImage = product.urlImage;
    this.formData.image = null; // reset file
  }

  // Reset form
  resetForm() {
    this.selectedProduct = null;
    this.formData = { nameProduct: '', price: '', image: null };
    this.previewImage = null;
  }

  // Thêm hoặc cập nhật sản phẩm
  submitForm() {
    const token = localStorage.getItem('accessToken');
    if (!token) { alert('Bạn chưa đăng nhập!'); return; }
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    const fd = new FormData();
    fd.append('nameProduct', this.formData.nameProduct);
    fd.append('price', this.formData.price);
    if (this.formData.image) fd.append('image', this.formData.image);

    if (this.selectedProduct) {
      // Update
      this.http.put(`http://localhost:8000/api/cashier/updateProduct/${this.selectedProduct._id}`, fd, { headers })
        .subscribe({
          next: () => { alert('Cập nhật thành công!'); this.loadProducts(); this.resetForm(); },
          error: err => { console.error(err); alert('Cập nhật thất bại!'); }
        });
    } else {
      // Create
      this.http.post('http://localhost:8000/api/cashier/uploadProduct', fd, { headers })
        .subscribe({
          next: () => { alert('Upload thành công!'); this.loadProducts(); this.resetForm(); },
          error: err => { console.error(err); alert('Upload thất bại!'); }
        });
    }
  }


  // Xóa sản phẩm
  deleteProduct() {
    if (!this.selectedProduct) return;
    if (!confirm('Bạn có chắc muốn xoá sản phẩm này không?')) return;

    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.delete(`http://localhost:8000/api/cashier/deleteProduct/${this.selectedProduct._id}`, { headers })
      .subscribe({
        next: () => { alert('Xoá thành công!'); this.loadProducts(); this.resetForm(); },
        error: err => { console.error(err); alert('Xoá thất bại!'); }
      });
  }
}

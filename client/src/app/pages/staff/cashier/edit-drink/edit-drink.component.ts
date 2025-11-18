import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';

interface Product {
  _id: string;
  nameProduct: string;
  price: number;
  category: string;
  urlImage: string;
}

@Component({
  selector: 'app-edit-drink',
  templateUrl: './edit-drink.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./edit-drink.component.scss']
})
export class EditDrinkComponent implements OnInit {
  products: Product[] = [];
  categories: string[] = ['Coffee', 'Tea', 'Juice', 'Food', 'Other']; // bạn thay category thật
  selectedFile: File | null = null;
  editForm: FormGroup;
  selectedProductId: string | null = null;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      nameProduct: [''],
      price: [''],
      category: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.authService.getAllProducts().subscribe({
      next: (res) => {
        if (res.success) this.products = res.dataProduct;
      },
      error: (err) => console.error(err)
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) this.selectedFile = file;
  }

  // --------- Upload mới ---------
  uploadProduct() {
    if (!this.editForm.value.nameProduct || !this.editForm.value.price || !this.selectedFile) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin và chọn ảnh';
      return;
    }

    const formData = new FormData();
    formData.append('nameProduct', this.editForm.value.nameProduct);
    formData.append('price', this.editForm.value.price);
    formData.append('category', this.editForm.value.category);
    formData.append('image', this.selectedFile);
    this.loading = true;

    this.authService.uploadProduct(formData).subscribe({
      next: (res) => {
        console.log(res);
        this.loadProducts();
        this.editForm.reset();
        this.selectedFile = null;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }

    });
  }

  selectProduct(product: Product) {
    this.selectedProductId = product._id;
    this.editForm.patchValue({
      nameProduct: product.nameProduct,
      price: product.price,
      category: product.category
    });
  }

  updateProduct() {
    if (!this.selectedProductId) {
      this.errorMessage = 'Chọn sản phẩm để cập nhật';
      return;
    }

    const formData = new FormData();
    formData.append('nameProduct', this.editForm.value.nameProduct);
    formData.append('price', this.editForm.value.price);
    formData.append('category', this.editForm.value.category);
    if (this.selectedFile) formData.append('image', this.selectedFile);

    this.loading = true;
    this.authService.updateProduct(this.selectedProductId, formData).subscribe({
      next: (res) => {
        console.log(res);
        this.loadProducts();
        this.editForm.reset();
        this.selectedFile = null;
        this.selectedProductId = null;
        this.loading = false;
      },
      error: (err) => {
        console.error(err)
        this.loading = false;
      }
    });
  }

  // --------- Delete sản phẩm ---------
  deleteProduct(productId: string) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

    this.authService.deleteProduct(productId).subscribe({
      next: (res) => {
        console.log(res);
        this.loadProducts();
      },
      error: (err) => console.error(err)
    });
  }
}

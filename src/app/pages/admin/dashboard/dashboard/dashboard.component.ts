import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/services/products/product.service';
import { Product } from 'src/app/interfaces/Product';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  products!: Product[];

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getProducts().subscribe((data: any) => {
      this.products = data;
    });
  }
  fetchBooks() {
    this.productService.getProducts().subscribe((data: any[]) => {
      this.products = data;
    });
  }
  editBook(book: Product) {
    // Xử lý tác vụ sửa sách ở đây
  }

  deleteBook(book: any) {
    const confirmDelete = confirm(`Bạn có chắc muốn xóa sách: ${book.Title}?`);

    if (confirmDelete) {
      this.productService.deleteProduct(book.id).subscribe(() => {
        // Xóa sách khỏi mảng books
        this.products = this.products.filter((b) => b.id !== book.id);
      });
    }
  }

}
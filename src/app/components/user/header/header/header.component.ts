import { Component } from '@angular/core';
import { ProductService } from 'src/services/products/product.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchQuery: string = '';
  filteredBooks: any[] = [];
  maxProductsToShow: number = 4;
  constructor(private bookService: ProductService) { }

  searchBooks() {
    const query = this.searchQuery.toLowerCase();

    this.bookService.getProducts().subscribe((data: any) => {
      // Lọc dữ liệu sách dựa trên tiêu đề và giới hạn tối đa 4 sản phẩm
      this.filteredBooks = data.filter((book: any) => {
        return book.Title.toLowerCase().includes(query) && this.filteredBooks.length < this.maxProductsToShow;
      });
    });
  }
}
import { Component, HostListener } from '@angular/core';
import { ProductService } from 'src/services/products/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchQuery: string = '';
  filteredBooks: any[] = [];
  maxProductsToShow: number = 4;
  showSearchResults: boolean = false;
  constructor(private bookService: ProductService, private route: ActivatedRoute) {
    // Đặt biến showSearchResults thành false sau khi chuyển hướng
    this.showSearchResults = false;
  }
  showProductDetails(book: any) {
    // Thay đổi URL để chuyển đến trang chi tiết sản phẩm và load lại trang
    window.location.href = `/${book.ID}/detailpage`;
  }

  searchBooks() {
    const query = this.searchQuery.toLowerCase();

    this.bookService.getProducts().subscribe((data: any) => {
      // Lọc dữ liệu sách dựa trên tiêu đề và giới hạn tối đa 4 sản phẩm
      this.filteredBooks = data.filter((book: any) => {
        return book.Title.toLowerCase().includes(query) && this.filteredBooks.length < this.maxProductsToShow;
      });

      // Hiển thị kết quả tìm kiếm khi có kết quả
      this.showSearchResults = this.filteredBooks.length > 0;
    });
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    // Ẩn kết quả tìm kiếm khi người dùng bấm vào bất kỳ chỗ nào khác trên trang
    if (!event.target) {
      this.showSearchResults = false;
    }
  }
}



import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/services/products/product.service';
// import Swiper core and required modules
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {

  products: any[] = [];// Khai báo một mảng chứa danh sách sản phẩm

  constructor(private productService: ProductService) {}

  ngOnInit() {
    // Gọi phương thức getProducts từ service để lấy danh sách sản phẩm
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      console.log(data);
      
    });
  }



  onSwiper(swiper: any) {
    console.log(swiper);
  }
  onSlideChange() {
    console.log('slide change');
  }
}

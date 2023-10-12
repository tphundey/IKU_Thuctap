import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/services/products/product.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-detailpage',
  templateUrl: './detailpage.component.html',
  styleUrls: ['./detailpage.component.css']
})
export class DetailpageComponent implements OnInit {
  productId: string = '';
  product: any;
  categories: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.getProductDetail(this.productId);

      // Thực hiện cuộc gọi API để lấy danh mục và gán vào biến categories
      this.http.get<any[]>('http://localhost:3000/Categories').subscribe((data: any[]) => {
        this.categories = data;
        console.log('Danh sách danh mục từ API:', data);
      });
    });
  }

  getProductDetail(id: string) {
    this.productService.getProductById(id).subscribe((data: any) => {
      this.product = data;
    });
  }

  getCategoryName(categoryID: number): string {
    console.log('Category ID:', categoryID);
    const category = this.categories.find(cat => cat.id === categoryID);
    console.log('Found Category:', category);
    return category ? category.Name : 'Unknown';
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/services/products/product.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detailpage',
  templateUrl: './detailpage.component.html',
  styleUrls: ['./detailpage.component.css']
})
export class DetailpageComponent implements OnInit {
  productId: string = '';
  product: any;
  categories: any[] = [];
  relatedProducts: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.getProductDetail(this.productId);

      this.http.get<any[]>('http://localhost:3000/Categories').subscribe((data: any[]) => {
        this.categories = data;
        console.log('Danh sách danh mục từ API:', data);

        this.showRelatedProducts();
      });
    });
  }

  getProductDetail(id: string) {
    this.productService.getProductById(id).subscribe((data: any) => {
      this.product = data;
    });
  }

  getCategoryName(categoryID: number): string {
    const category = this.categories.find(cat => cat.id === categoryID);
    return category ? category.Name : 'Unknown';
  }

  showRelatedProducts() {
    if (this.product && this.categories) {
      const categoryId = this.product.CategoryID;
  
      // Sử dụng subscribe để lấy dữ liệu từ Observable
      this.productService.getProducts().subscribe((products: any[]) => {
        // Lọc sản phẩm cùng loại "Khóa học" (CategoryID = 1)
        this.relatedProducts = products.filter(product => product.CategoryID === 1);
      });
    }
  }
}

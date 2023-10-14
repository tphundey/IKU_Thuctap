// edit-product.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/services/products/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from 'src/services/categories/categories.service';
@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent {
  product: any = {};
  categories: any[] = [];
  constructor(
    private productService: ProductService,
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      const productId = params['id'];
      if (productId) {
        this.productService.getProductById(productId).subscribe((data) => {
          this.product = data;
        });
      }
    });
    this.categoriesService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }
  updateProduct() {
    this.productService.updateProduct(this.product).subscribe(() => {
      console.log("Thành công");

      this.router.navigate(['/admin/dashboard']);
    });
  }
}

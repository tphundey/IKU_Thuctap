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

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((data: any) => {
          this.products = data;
      });
  }
}
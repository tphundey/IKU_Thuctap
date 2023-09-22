import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from 'src/app/interfaces/Product';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`http://localhost:8080/api/products`)
  }
  deleteProduct(id: number | string): Observable<Product> {
    return this.http.delete<Product>(`http://localhost:8080/api/products/${id}`)
  }
  getProductById(id: number | string): Observable<Product> {
    return this.http.get<Product>(`http://localhost:8080/api/products/${id}`)
  }
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`http://localhost:8080/api/products`, product)
  }
  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`http://localhost:8080/api/products/${product.id}`, product)
  }
}
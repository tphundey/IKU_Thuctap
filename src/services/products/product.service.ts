// product.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000'; // Thay YOUR_API_URL_HERE bằng URL của API

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Books`);
  }
  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Books/${id}`);
  }
   // Phương thức để xóa sách dựa trên ID
   deleteProduct(bookId: number): Observable<any> {
    const deleteUrl = `${this.apiUrl}/Books/${bookId}`;
    return this.http.delete(deleteUrl);
  }
}

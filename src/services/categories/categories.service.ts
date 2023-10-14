import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = 'http://localhost:3000/Categories';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<any[]> {
    const observable = this.http.get<any[]>(this.apiUrl);

    observable.subscribe(data => {
      console.log('Dữ liệu từ API:', data);
    });

    return observable;
  }

  
}

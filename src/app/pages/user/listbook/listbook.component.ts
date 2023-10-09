import { Component } from '@angular/core';

@Component({
  selector: 'app-listbook',
  templateUrl: './listbook.component.html',
  styleUrls: ['./listbook.component.css']
})
export class ListbookComponent {

  first: number = 0; // Gán giá trị mặc định cho first

  rows: number = 10; // Gán giá trị mặc định cho rows

  onPageChange(event: any) {
    this.first = event.first || 0; // Sử dụng giá trị mặc định nếu event.first là undefined
    this.rows = event.rows || 10; // Sử dụng giá trị mặc định nếu event.rows là undefined
  }
}
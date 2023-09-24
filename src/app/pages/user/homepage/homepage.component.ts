import { Component } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
 
  products = [
    { name: 'Sản phẩm 1', description: 'Mô tả sản phẩm 1', imageUrl: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/40052.jpg?v=1&w=200&h=292' },
    { name: 'Sản phẩm 2', description: 'Mô tả sản phẩm 2', imageUrl: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/40052.jpg?v=1&w=200&h=292' },
    { name: 'Sản phẩm 3', description: 'Mô tả sản phẩm 3', imageUrl: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/40052.jpg?v=1&w=200&h=292' },
    { name: 'Sản phẩm 1', description: 'Mô tả sản phẩm 1', imageUrl: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/40052.jpg?v=1&w=200&h=292' },
    { name: 'Sản phẩm 2', description: 'Mô tả sản phẩm 2', imageUrl: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/40052.jpg?v=1&w=200&h=292' },
    { name: 'Sản phẩm 3', description: 'Mô tả sản phẩm 3', imageUrl: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/40052.jpg?v=1&w=200&h=292' },
  ];
  groupedProducts = this.groupArray(this.products, 4);

  // Hàm chia mảng thành các nhóm
  groupArray(array: any[], groupSize: number) {
    const grouped = [];
    for (let i = 0; i < array.length; i += groupSize) {
      grouped.push(array.slice(i, i + groupSize));
    }
    return grouped;
  }
}

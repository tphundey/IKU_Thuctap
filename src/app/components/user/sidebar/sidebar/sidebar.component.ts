import { Component, OnInit, HostListener } from '@angular/core';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  images = ['https://theme.hstatic.net/200000343865/1001052087/14/ms_banner_img2.jpg?v=337', 'https://theme.hstatic.net/200000343865/1001052087/14/ms_banner_img1.jpg?v=337', 'https://theme.hstatic.net/200000343865/1001052087/14/ms_banner_img3.jpg?v=337']; // Thay đổi danh sách ảnh theo ý muốn
  currentIndex = 0;
  startX: number | undefined;
  dragging = false;
  offset = 0;

  constructor() { }

  ngOnInit(): void {
    setInterval(() => {
      if (!this.dragging) {
        this.showNextImage();
      }
    }, 2000);
  }

  showNextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  showPreviousImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  onMouseDown(event: MouseEvent) {
    this.startX = event.clientX;
    this.dragging = true;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.dragging || this.startX === undefined) {
      return;
    }

    const deltaX = event.clientX - this.startX;
    this.offset = deltaX;
  }

  onMouseUp(event: MouseEvent) {
    if (this.offset > 50) {
      this.showPreviousImage();
    } else if (this.offset < -50) {
      this.showNextImage();
    }

    this.dragging = false;
    this.startX = undefined;
    this.offset = 0;
  }
}
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {FooterComponent} from '../footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  images: string[] = [
    'assets/Carousel1.png',
    'assets/Carousel2.png',
    'assets/Carousel3.png',
    'assets/Carousel4.png',
  ];

  menuItems = [
    { img: 'assets/AboutUs1.png', name: 'Black Coffee', description: 'Prepared by forcing hot water under high pressure through finely ground coffee.\n', cost: "20.000đ" },
    { img: 'assets/AboutUs1.png', name: 'Black Coffee', description: 'Prepared by forcing hot water under high pressure through finely ground coffee.\n', cost: "20.000đ" },
    { img: 'assets/AboutUs1.png', name: 'Black Coffee', description: 'Prepared by forcing hot water under high pressure through finely ground coffee.\n', cost: "20.000đ" },
    { img: 'assets/AboutUs1.png', name: 'Black Coffee', description: 'Prepared by forcing hot water under high pressure through finely ground coffee.\n', cost: "20.000đ" },
    { img: 'assets/AboutUs1.png', name: 'Black Coffee', description: 'Prepared by forcing hot water under high pressure through finely ground coffee.\n', cost: "20.000đ" },
    { img: 'assets/AboutUs1.png', name: 'Black Coffee', description: 'Prepared by forcing hot water under high pressure through finely ground coffee.\n', cost: "20.000đ" },


    // thêm các món khác
  ];

  currentIndex = 0;
  intervalMs = 2000;
  private timerId: any = null;

  currentMenuIndex = 0;
  itemsPerPage = 3;

  get trackTransform(): string {
    return `translateX(-${this.currentIndex * 100}%)`;
  }

  ngOnInit(): void {
    this.play();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  play(): void {
    this.clearTimer();
    this.timerId = setInterval(() => this.next(), this.intervalMs);
  }

  pause(): void {
    this.clearTimer();
  }

  clearTimer(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prev(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goTo(i: number): void {
    this.currentIndex = i;
    this.play();
  }

  //render menu items
  get menuTransform() {
    return `translateX(-${(this.currentMenuIndex * 100) / this.itemsPerPage}%)`;
  }

  nextMenu() {
    if (this.currentMenuIndex < this.menuItems.length - this.itemsPerPage) {
      this.currentMenuIndex++;
    }
  }

  prevMenu() {
    if (this.currentMenuIndex > 0) {
      this.currentMenuIndex--;
    }
  }
}

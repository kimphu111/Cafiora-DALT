import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
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

  currentIndex = 0;
  intervalMs = 2000;
  private timerId: any = null;

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
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  private currentSlide = 0;
  private slides!: NodeListOf<HTMLElement>;
  private indicators!: NodeListOf<HTMLButtonElement>;

  ngOnInit(): void {
    this.slides = document.querySelectorAll('.carousel-item');
    this.indicators = document.querySelectorAll('.carousel-indicator');

    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');

    if (prevButton && nextButton) {
      prevButton.addEventListener('click', () => this.changeSlide(this.currentSlide - 1));
      nextButton.addEventListener('click', () => this.changeSlide(this.currentSlide + 1));
    }

    this.updateCarousel();
  }

  private changeSlide(newIndex: number): void {
    if (newIndex < 0) {
      this.currentSlide = this.slides.length - 1;
    } else if (newIndex >= this.slides.length) {
      this.currentSlide = 0;
    } else {
      this.currentSlide = newIndex;
    }

    this.updateCarousel();
  }

  private updateCarousel(): void {
    this.slides.forEach((slide, index) => {
      slide.classList.toggle('opacity-100', index === this.currentSlide);
      slide.classList.toggle('opacity-0', index !== this.currentSlide);
      slide.classList.toggle('hidden', index !== this.currentSlide);
    });

    this.indicators.forEach((indicator, index) => {
      indicator.style.backgroundColor = index === this.currentSlide ? '#D16A54' : '#FFFFFF';
      indicator.style.opacity = index === this.currentSlide ? '1' : '0.5';
    });
  }
}

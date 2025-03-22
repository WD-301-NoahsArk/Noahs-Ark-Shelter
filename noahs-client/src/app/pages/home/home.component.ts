import { Component, OnInit } from '@angular/core';
import { Carousel } from 'flowbite';
import type { CarouselItem, CarouselOptions, CarouselInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';
import { ButtonComponent } from '../../component/button/button.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    ButtonComponent
  ]
})
export class HomeComponent implements OnInit {

  ngOnInit(): void {
    // Initialize Flowbite components
    const carouselElement: HTMLElement | null = document.getElementById('carousel-example');
    if (!carouselElement) return;

    const items: CarouselItem[] = [
      {
        position: 0,
        el: document.getElementById('carousel-item-1') as HTMLElement,
      },
      {
        position: 1,
        el: document.getElementById('carousel-item-2') as HTMLElement,
      },
      {
        position: 2,
        el: document.getElementById('carousel-item-3') as HTMLElement,
      },
    ]

    const options: CarouselOptions = {
      defaultPosition: 0,
      indicators: {
        activeClasses: 'bg-maincolor-200 dark:bg-maincolor-200',
        inactiveClasses: 'bg-white',
        items: [
          {
            position: 0,
            el: document.getElementById('carousel-indicator-1') as HTMLElement,
          },
          {
            position: 1,
            el: document.getElementById('carousel-indicator-2') as HTMLElement,
          },
          {
            position: 2,
            el: document.getElementById('carousel-indicator-3') as HTMLElement,
          },
        ],
      },
    };

    // instance options object
    const instanceOptions: InstanceOptions = {
      id: 'carousel-example',
      override: true,
    };

    const carousel: CarouselInterface = new Carousel(carouselElement, items, options, instanceOptions);

    // set event listeners for prev and next buttons
    const $prevButton = document.getElementById('data-carousel-prev');
    const $nextButton = document.getElementById('data-carousel-next');

    const resetCarousel = () => {
      carousel.prev()
      carousel.prev()
      return
    }

    const cycleCarousel = () => {
      if (carousel._activeItem.position === items.length - 1) {
        resetCarousel()
        return
      }
      carousel.next()
    }

    setInterval(cycleCarousel, 5000)

    if ($prevButton && $nextButton) {
      $prevButton.addEventListener('click', () => {
        carousel.prev();
      });

      $nextButton.addEventListener('click', () => {
        if (carousel._activeItem.position === items.length - 1) {
          carousel.prev()
          carousel.prev()
          return
        }
        carousel.next();
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Carousel } from 'flowbite';
import type { CarouselItem, CarouselOptions, CarouselInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  ngOnInit(): void {
    // Make sure DOM is fully loaded before interacting with elements
    const carouselElement: HTMLElement | null = document.getElementById('carousel-example');
    if (!carouselElement) return;

    const items: CarouselItem[] = [
      {
        position: 0,
        el: document.getElementById('carousel-item-1') as HTMLElement, // Type assertion
      },
      {
        position: 1,
        el: document.getElementById('carousel-item-2') as HTMLElement, // Type assertion
      },
      {
        position: 2,
        el: document.getElementById('carousel-item-3') as HTMLElement, // Type assertion
      },
    ];

    // object options with default values
    const options: CarouselOptions = {
      defaultPosition: 1,
      interval: 3000,
      indicators: {
        activeClasses: 'bg-maincolor-200 dark:bg-maincolor-200',
        inactiveClasses: 'bg-white',
        items: [
          {
            position: 0,
            el: document.getElementById('carousel-indicator-1') as HTMLElement, // Type assertion
          },
          {
            position: 1,
            el: document.getElementById('carousel-indicator-2') as HTMLElement, // Type assertion
          },
          {
            position: 2,
            el: document.getElementById('carousel-indicator-3') as HTMLElement, // Type assertion
          },
        ],
      },
      onNext: () => {
        console.log('next slider item is shown');
      },
      onPrev: () => {
        console.log('previous slider item is shown');
      },
      onChange: () => {
        console.log('new slider item has been shown');
      },
    };

    // instance options object
    const instanceOptions: InstanceOptions = {
      id: 'carousel-example',
      override: true,
    };

    const carousel: CarouselInterface = new Carousel(carouselElement, items, options, instanceOptions);

    carousel.cycle();

    // set event listeners for prev and next buttons
    const $prevButton = document.getElementById('data-carousel-prev');
    const $nextButton = document.getElementById('data-carousel-next');

    if ($prevButton && $nextButton) {
      $prevButton.addEventListener('click', () => {
        carousel.prev();
      });

      $nextButton.addEventListener('click', () => {
        carousel.next();
      });
    }
  }
}

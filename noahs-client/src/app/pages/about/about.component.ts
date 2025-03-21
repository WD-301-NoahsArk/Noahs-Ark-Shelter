import { Component, OnInit } from '@angular/core';
import { Carousel } from 'flowbite';
import type { CarouselItem, CarouselOptions, CarouselInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {

  ngOnInit(): void {
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
    ];

    const options: CarouselOptions = {
      defaultPosition: 0,
      interval: 3000,
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

    const instanceOptions: InstanceOptions = {
      id: 'carousel-example',
      override: true,
    };

    const carousel: CarouselInterface = new Carousel(carouselElement, items, options, instanceOptions);
    carousel.cycle();

    document.getElementById('data-carousel-prev')?.addEventListener('click', () => carousel.prev());
    document.getElementById('data-carousel-next')?.addEventListener('click', () => carousel.next());
  }
}

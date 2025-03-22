import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpService } from '../../http.service';

export interface Event {
  id: number;
  title: string;
  details: string;
  thumbnail: string;
  venue: string;
  start_date: string;
  end_date: string;
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
  providers: [HttpService]
})
export class EventsComponent implements OnInit {
  eventData: Event[] = [];
  selectedEvent: Event | null = null;
  image = ""

  constructor(private http: HttpService) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.http.getEvents().subscribe({
      next: (data: Event[]) => {
        this.eventData = data;
        if (this.eventData.length > 0 && !this.selectedEvent) {
          this.selectEvent(this.eventData[0]);
        }
      },
      error: (err) => {
        console.error('Error loading events:', err);
      }
    });
  }

  selectEvent(event: Event) {
    this.selectedEvent = event;
  }
}

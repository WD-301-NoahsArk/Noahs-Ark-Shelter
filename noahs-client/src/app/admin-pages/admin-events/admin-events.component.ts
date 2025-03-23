import { Component, AfterViewInit, ElementRef, ViewChildren, QueryList, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../component/button/button.component';
import { HttpService } from '../../http.service';

export interface EventResponse {
  _id: number;
  title: string;
  details: string;
  thumbnail: string;
  venue: string;
  start_date: string;
  end_date: string;
}

export interface Event extends EventResponse {
  isEditing?: boolean;
  editData?: {
    title: string;
    details: string;
    thumbnail: string;
    venue: string;
    start_date: string;
    end_date: string;
  };
  editImageName?: string;
  isUploading?: boolean;
}

export interface EventUpdatePayload {
  title: string;
  details: string;
  thumbnail: string;
  venue: string;
  start_date: string;
  end_date: string;
}

export interface EventCreatePayload {
  title: string;
  details: string;
  thumbnail: string;
  venue: string;
  start_date: string;
  end_date: string;
}

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './admin-events.component.html',
  styleUrl: './admin-events.component.css'
})

export class AdminEventsComponent implements AfterViewInit, OnInit {
  @ViewChildren('eventText') eventTexts!: QueryList<ElementRef>;
  @ViewChildren('eventImage') eventImages!: QueryList<ElementRef>;
  events: Event[] = [];
  editStatus: boolean = true;
  showAddForm: boolean = false;

  selectedFile: File | null = null;
  selectedFileName: string = '';
  isUploading: boolean = false;

  newEvent: {
    title: string;
    details: string;
    thumbnail: string;
    venue: string;
    start_date: string;
    end_date: string;
  } = {
      title: '',
      details: '',
      thumbnail: '',
      venue: '',
      start_date: '',
      end_date: ''
    };

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.loadEvents();
  }

  ngAfterViewInit() {
    this.matchTextToImageHeight();
    window.addEventListener('resize', () => {
      this.matchTextToImageHeight();
    });
  }

  matchTextToImageHeight() {
    setTimeout(() => {
      if (this.eventImages && this.eventTexts) {
        this.eventImages.forEach((img, idx) => {
          const textEle = this.eventTexts.toArray()[idx]?.nativeElement;
          const imgEle = img.nativeElement;
          if (textEle && imgEle.clientHeight > 0) {
            if (imgEle.clientHeight < 200) {
              textEle.style.height = '200px';
              return;
            } else {
              textEle.style.height = `${imgEle.clientHeight}px`;
              textEle.style.maxHeight = `${imgEle.clientHeight}px`;
            }
          }
        });
      }
    }, 0);
  }

  loadEvents() {
    this.http.getEvents().subscribe({
      next: (data: Event[]) => {
        this.events = data;
      },
      error: (err) => {
        console.error('Error loading events:', err);
      }
    });
  }

  add = () => {
    this.showAddForm = true;
    this.newEvent = {
      title: '',
      details: '',
      thumbnail: '',
      venue: '',
      start_date: '',
      end_date: ''
    };
    this.selectedFile = null;
    this.selectedFileName = '';
    this.isUploading = false;
  }

  onImageSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.selectedFileName = this.selectedFile?.name || '';

      this.uploadFile();
    }
  }

  onEditImageSelected(event: any, eventItem: Event) {
    const files = event.target.files;
    if (files && files.length > 0 && eventItem.editData) {
      const file = files[0];
      eventItem.editImageName = file.name;
      eventItem.isUploading = true;

      this.uploadEditFile(file, eventItem);
    }
  }

  uploadFile() {
    if (!this.selectedFile) return;

    this.isUploading = true;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.uploadFile(formData).subscribe({
      next: (response: any) => {
        this.newEvent.thumbnail = response.urlImage;
        this.isUploading = false;
      },
      error: (error) => {
        console.error('Error uploading file:', error);
        alert('Failed to upload file. Please try again.');
        this.isUploading = false;
      }
    });
  }

  uploadEditFile(file: File, eventItem: Event) {
    if (!eventItem.editData) return;

    const formData = new FormData();
    formData.append('file', file);

    this.http.uploadFile(formData).subscribe({
      next: (response: any) => {
        if (eventItem.editData) {
          eventItem.editData.thumbnail = response.urlImage;
        }
        eventItem.isUploading = false;
      },
      error: (error) => {
        console.error('Error uploading file:', error);
        alert('Failed to upload file. Please try again.');
        eventItem.isUploading = false;
      }
    });
  }

  submitNewEvent() {
    if (!this.newEvent.title || !this.newEvent.venue || !this.newEvent.start_date || !this.newEvent.end_date) {
      alert('Please fill in all required fields: Title, Venue, Start Date, and End Date');
      return;
    }

    if (this.isUploading) {
      alert('Please wait for the image to finish uploading.');
      return;
    }

    this.http.postEvent(this.newEvent).subscribe({
      next: (response: EventResponse) => {
        const createdEvent: Event = {
          ...response,
          isEditing: false
        };
        this.events.unshift(createdEvent);
        this.showAddForm = false;
        setTimeout(() => {
          this.matchTextToImageHeight();
        }, 100);
        window.location.reload();
      },
      error: (error) => {
        console.error('Error adding event:', error);
        alert('Failed to add event. Please try again.');
      }
    });
  }

  cancelAdd() {
    this.showAddForm = false;
    this.selectedFile = null;
    this.selectedFileName = '';
  }

  del = () => {
    this.editStatus = false;
  }

  deleteEvent(event: Event) {
    if (!this.editStatus) {
      if (confirm(`Are you sure you want to delete this event? ${event.title}`)) {
        this.http.delEvent(event._id).subscribe({
          next: () => {
            this.events = this.events.filter(e => e._id !== event._id);
          },
          error: (error) => {
            console.error('Error deleting event:', error);
            alert('Failed to delete event. Please try again.');
          }
        });
      }
    }
  }

  edit = () => {
    this.editStatus = !this.editStatus;
  }

  toggleEdit = (event: Event) => {
    if (!this.editStatus) {
      return;
    }
    if (!event.isEditing) {
      event.editData = {
        title: event.title,
        details: event.details,
        thumbnail: event.thumbnail,
        venue: event.venue,
        start_date: event.start_date,
        end_date: event.end_date
      };
      event.editImageName = '';
      event.isUploading = false;
    }
    event.isEditing = !event.isEditing;
  }

  submitEdit(event: Event) {
    if (!event.editData) return;

    if (event.isUploading) {
      alert('Please wait for the image to finish uploading.');
      return;
    }

    const updatePayload: EventUpdatePayload = {
      title: event.editData.title,
      details: event.editData.details,
      thumbnail: event.editData.thumbnail,
      venue: event.editData.venue,
      start_date: event.editData.start_date,
      end_date: event.editData.end_date
    };

    const originalData = {
      title: event.title,
      details: event.details,
      thumbnail: event.thumbnail,
      venue: event.venue,
      start_date: event.start_date,
      end_date: event.end_date
    };

    Object.assign(event, updatePayload);

    this.http.putEvent(event._id, updatePayload).subscribe({
      next: (res: EventResponse) => {
        Object.assign(event, res);
        event.isEditing = false;
      },
      error: (err) => {
        console.error("Error updating event", err);
        Object.assign(event, originalData);
        alert("Failed to update event. Please try again.");
      },
      complete: () => {
        event.isEditing = false;
        window.location.reload();
      }
    });
  }

  cancelEdit(event: Event) {
    event.isEditing = false;
    event.editData = undefined;
    event.editImageName = '';
    event.isUploading = false;
  }
}

import { Component, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../component/button/button.component';
import { HttpService } from '../../http.service';

export interface AnimalResponse {
  _id?: number;
  name: string;
  rescue_date: string;
  personality: Array<2>;
  breed: string;
  code: string;
  status: boolean;
  animal_pic: string;
}

export interface Animal extends AnimalResponse {
  _id?: number;
  isEditing?: boolean;
  editData?: {
    name: string;
    rescue_date: string;
    personality: Array<2>;
    breed: string;
    code: string;
    status: boolean;
    animal_pic: string;
  };
  editImageName?: string;
  isUploading?: boolean;
}

export interface AnimalUpdatePayload {
  name: string;
  rescue_date: string;
  personality: Array<2>;
  breed: string;
  code: string;
  status: boolean;
  animal_pic: string;
}

export interface AnimalCreatePayload {
  name: string;
  rescue_date: string;
  personality: Array<2>;
  breed: string;
  code: string;
  status: boolean;
  animal_pic: string;
}

@Component({
  selector: 'app-admin-adoption',
  imports: [CommonModule, ButtonComponent, FormsModule],
  templateUrl: './admin-adoption.component.html',
  styleUrl: './admin-adoption.component.css'
})
export class AdminAdoptionComponent {
  @ViewChildren('animalText') animalTexts!: QueryList<ElementRef>;
  @ViewChildren('animalImage') animalImages!: QueryList<ElementRef>;
  animals: Animal[] = [];
  editStatus: boolean = true;
  showAddForm: boolean = false;

  selectedFile: File | null = null;
  selectedFileName: string = '';
  isUploading: boolean = false;

  newAnimal: {
    name: string;
    rescue_date: string;
    personality: Array<2>;
    breed: string;
    code: string;
    status: boolean;
    animal_pic: string;
  } = {
      name: '',
      rescue_date: '',
      personality: [],
      breed: '',
      code: '',
      status: false,
      animal_pic: ''
    };

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.loadAnimals();
  }

  ngAfterViewInit() {
    this.matchTextToImageHeight();
    window.addEventListener('resize', () => {
      this.matchTextToImageHeight();
    });
  }

  matchTextToImageHeight() {
    setTimeout(() => {
      if (this.animalImages && this.animalTexts) {
        this.animalImages.forEach((img, idx) => {
          const textEle = this.animalTexts.toArray()[idx]?.nativeElement;
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

  loadAnimals() {
    this.http.getAnimals().subscribe({
      next: (data: Animal[]) => {
        this.animals = data;
      },
      error: (err) => {
        console.error('Error loading animals:', err);
      }
    });
  }

  addPet = () => {
    this.showAddForm = true;
    this.newAnimal = {
      name: '',
      rescue_date: '',
      personality: [],
      breed: '',
      code: '',
      status: false,
      animal_pic: ''
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

  onEditImageSelected(event: any, animal: Animal) {
    const files = event.target.files;
    if (files && files.length > 0 && animal.editData) {
      const file = files[0];
      animal.editImageName = file.name;
      animal.isUploading = true;

      this.uploadEditFile(file, animal);
    }
  }

  uploadFile() {
    if (!this.selectedFile) return;

    this.isUploading = true;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.uploadFile(formData).subscribe({
      next: (response: any) => {
        this.newAnimal.animal_pic = response.urlImage;
        this.isUploading = false;
      },
      error: (error) => {
        console.error('Error uploading file:', error);
        alert('Failed to upload file. Please try again.');
        this.isUploading = false;
      }
    });
  }

  uploadEditFile(file: File, animal: Animal) {
    if (!animal.editData) return;

    const formData = new FormData();
    formData.append('file', file);

    this.http.uploadFile(formData).subscribe({
      next: (response: any) => {
        if (animal.editData) {
          animal.editData.animal_pic = response.urlImage;
        }
        animal.isUploading = false;
      },
      error: (error) => {
        console.error('Error uploading file:', error);
        alert('Failed to upload file. Please try again.');
        animal.isUploading = false;
      }
    });
  }

  submitNewAnimal() {
    if (!this.newAnimal.name || !this.newAnimal.rescue_date || !this.newAnimal.breed || !this.newAnimal.code) {
      alert('Please fill in all required fields: Name, Rescue Date, Breed, and Code');
      return;
    }

    if (this.isUploading) {
      alert('Please wait for the image to finish uploading.');
      return;
    }

    this.http.postAnimal(this.newAnimal).subscribe({
      next: (response: AnimalResponse) => {
        const createdAnimal: Animal = {
          ...response,
          isEditing: false
        };
        this.animals.unshift(createdAnimal);
        this.showAddForm = false;
        setTimeout(() => {
          this.matchTextToImageHeight();
        }, 100);
        window.location.reload();
      },
      error: (error) => {
        console.error('Error adding animal:', error);
        alert('Failed to add animal. Please try again.');
      }
    });
  }

  cancelAdd() {
    this.showAddForm = false;
    this.selectedFile = null;
    this.selectedFileName = '';
  }

  delPet = () => {
    this.editStatus = false;
  }

  deleteAnimal(animal: Animal) {
    if (!this.editStatus) {
      if (confirm(`Are you sure you want to delete this animal? ${animal.name}`)) {
        this.http.delAnimal(animal._id || 0).subscribe({
          next: () => {
            this.animals = this.animals.filter(e => e._id !== animal._id);
          },
          error: (error) => {
            console.error('Error deleting animal:', error);
            alert('Failed to delete animal. Please try again.');
          }
        });
      }
    }
  }

  editPet = () => {
    this.editStatus = !this.editStatus;
  }

  toggleEdit(animal: Animal) {
    if (!this.editStatus) {
      return;
    }
    if (!animal.isEditing) {
      animal.editData = {
        name: animal.name,
        rescue_date: animal.rescue_date,
        personality: animal.personality,
        breed: animal.breed,
        code: animal.code,
        status: animal.status,
        animal_pic: animal.animal_pic
      };
      animal.editImageName = '';
      animal.isUploading = false;
    }
    animal.isEditing = !animal.isEditing;
  }

  submitEdit(animal: Animal) {
    if (!animal.editData) return;

    if (animal.isUploading) {
      alert('Please wait for the image to finish uploading.');
      return;
    }

    const updatePayload: AnimalUpdatePayload = {
      name: animal.editData.name,
      rescue_date: animal.editData.rescue_date,
      personality: animal.editData.personality,
      breed: animal.editData.breed,
      code: animal.editData.code,
      status: animal.editData.status,
      animal_pic: animal.editData.animal_pic
    };

    const originalData = {
      name: animal.name,
      rescue_date: animal.rescue_date,
      personality: animal.personality,
      breed: animal.breed,
      code: animal.code,
      status: animal.status,
      animal_pic: animal.animal_pic
    };

    Object.assign(animal, updatePayload);

    this.http.putAnimal(animal._id || 0, updatePayload).subscribe({
      next: (res: AnimalResponse) => {
        Object.assign(animal, res);
        animal.isEditing = false;
      },
      error: (err) => {
        console.error("Error updating animal", err);
        Object.assign(animal, originalData);
        alert("Failed to update animal. Please try again.");
      },
      complete: () => {
        animal.isEditing = false;
        window.location.reload();
      }
    });
  }

  cancelEdit(animal: Animal) {
    animal.isEditing = false;
    animal.editData = undefined;
    animal.editImageName = '';
    animal.isUploading = false;
  }
}

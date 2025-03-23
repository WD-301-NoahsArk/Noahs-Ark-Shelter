import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { EventsComponent } from './pages/events/events.component';
import { AdoptionComponent } from './pages/adoption/adoption.component';
import { LoginComponent } from './pages/login/login.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { AdminAdoptionComponent } from './admin-pages/admin-adoption/admin-adoption.component';
import { AdminEventsComponent } from './admin-pages/admin-events/admin-events.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'adoption', component: AdoptionComponent },
  { path: 'events', component: EventsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin/adoption', component: AdminAdoptionComponent },
  { path: 'admin/events', component: AdminEventsComponent },
  { path: '**', component: NotfoundComponent }
];

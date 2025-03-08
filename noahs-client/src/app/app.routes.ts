import { Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { AboutComponent } from './page/about/about.component';
import { ContactComponent } from './page/contact/contact.component';
import { EventsComponent } from './page/events/events.component';
import { AdoptionComponent } from './page/adoption/adoption.component';


export const routes: Routes = [
    {path: '',
    component: HomeComponent},
    {path: 'about',
    component: AboutComponent},
    {path: 'contact',
    component: ContactComponent},
    {path: 'events',
    component: EventsComponent},
    {path: 'adoption',
    component: AdoptionComponent}
];

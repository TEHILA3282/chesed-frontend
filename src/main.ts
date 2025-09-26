import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';
import 'zone.js';

bootstrapApplication(AppComponent, {
  ...appConfig,                
  providers: [
    ...(appConfig.providers || []), 
    provideAnimations()          
  ]
}).catch(err => console.error(err));

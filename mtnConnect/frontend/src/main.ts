import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// appConfig already includes provideRouter, provideHttpClient, and the auth interceptor
bootstrapApplication(AppComponent, appConfig);





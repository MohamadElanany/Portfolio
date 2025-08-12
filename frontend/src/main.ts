import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { App } from './app/app';
import { routes } from './app/app.routes';

import { LucideAngularModule } from 'lucide-angular';
import {
  User, Code, Briefcase, GraduationCap, Mail, Sun, Moon,
  Github, Linkedin, Phone, MapPin, Brain, Palette, Users,
  Download, ArrowRight, ExternalLink
} from 'lucide';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
      ReactiveFormsModule,
      // سجّل أيقونات التطبيق هنا (ModuleWithProviders مقبول في importProvidersFrom)
      LucideAngularModule.pick({
        User, Code, Briefcase, GraduationCap, Mail, Sun, Moon,
        Github, Linkedin, Phone, MapPin, Brain, Palette, Users,
        Download, ArrowRight, ExternalLink
      })
    )
  ]
}).catch(err => console.error(err));

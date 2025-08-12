import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { Api } from '../../services/api';
import { environment } from '../../../environments/environment';

interface Course {
  name: string;
  description: string;
}

export interface Education {
  _id?: string;
  degree: string;
  university: string;
  year: string | number;
  description: string;
  courses: Course[];
  photoUrl?: string;
}

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education.html',
  styleUrls: ['./education.css']
})
export class EducationComponent implements OnInit {
  private api = inject(Api);

  // signal holds the single Education doc (or null)
  education = signal<Education | null>(null);

  ngOnInit(): void {
    this.getEducation();
  }

  getEducation(): void {
    // Use Api service (which calls `${environment.apiUrl}/education`)
    this.api.getEducation().pipe(
      map((res: any) => {
        // If backend returns array, use first item
        let doc: any = null;
        if (!res) return null;
        if (Array.isArray(res)) {
          doc = res.length ? res[0] : null;
        } else if (typeof res === 'object') {
          doc = res;
        }

        if (!doc) return null;

        // Normalize photoUrl: if relative (starts with /uploads...), prefix server base (environment.apiUrl without /api)
        let photo = doc.photoUrl ?? doc.imageUrl ?? '';
        if (photo && !/^https?:\/\//.test(photo)) {
          const serverBase = environment.apiUrl.replace(/\/api\/?$/, '');
          photo = `${serverBase}${photo.startsWith('/') ? '' : '/'}${photo}`;
        }
        if (!photo) photo = 'assets/placeholder.svg';

        return {
          ...doc,
          photoUrl: photo,
          // ensure courses is an array
          courses: Array.isArray(doc.courses) ? doc.courses : []
        } as Education;
      }),
      catchError((err) => {
        console.error('education fetch error', err);
        return of(null);
      })
    ).subscribe((ed: Education | null) => {
      if (ed) {
        this.education.set(ed);
      } else {
        this.setDefaultEducation();
      }
    });
  }

  private setDefaultEducation(): void {
    this.education.set({
      degree: 'Bachelor of Science in Computer Science',
      university: 'American University of Cairo (AUC)',
      year: '3rd Year Student',
      description:
        "Currently pursuing my Bachelor's degree in Computer Science at AUC, where I'm building a strong foundation in software engineering principles, algorithms, data structures, and modern programming practices.",
      courses: [
        { name: 'Full-Stack Development Diploma', description: 'Route Academy (In Progress)' },
        { name: 'React Full-Stack Certificate', description: 'Digital Egypt Pioneers Initiative (MCIT)' }
      ],
      photoUrl: 'assets/placeholder.svg'
    });
  }
}

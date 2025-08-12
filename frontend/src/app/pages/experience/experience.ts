import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Experience {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.html',
  styleUrl: './experience.css'
})
export class ExperienceComponent implements OnInit {
  private http = inject(HttpClient);

  experiences = signal<Experience[]>([]);
  achievements = [
    "React Full-Stack Certificate – DEPI (MCIT)",
    "Competitor at ECPC (Egyptian Collegiate Programming Contest)"
  ];

  ngOnInit(): void {
    this.getExperiences();
  }

  getExperiences(): void {
    this.http.get<Experience[]>('http://localhost:5000/api/experience')
      .subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.experiences.set(data);
          } else {
            // محتوى افتراضي للتصميم
            this.setDefaultExperience();
          }
        },
        error: (err) => {
          console.error('Error fetching experiences:', err);
          // محتوى افتراضي للتصميم
          this.setDefaultExperience();
        }
      });
  }

  private setDefaultExperience(): void {
    this.experiences.set([
      {
        jobTitle: 'Frontend Developer',
        company: 'Default Company',
        startDate: '2023-01-01',
        endDate: '',
        description: 'Worked on UI components and styling.'
      }
    ]);
  }
}


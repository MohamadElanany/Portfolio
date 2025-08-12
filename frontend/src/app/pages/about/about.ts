import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { LucideAngularModule } from 'lucide-angular';
import { Api } from '../../services/api';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, AsyncPipe],
  templateUrl: './about.html',
})
export class About {
  profile$: Observable<any>;

  constructor(private api: Api) {
    this.profile$ = this.api.getProfile().pipe(
      map((res: any) => {
        // handle response whether it's an object or an array (some backends return [doc])
        const p = Array.isArray(res) ? (res[0] ?? res) : (res ?? {});

        // normalize name/title/email/phone/location keys safely
        const normalized: any = {
          name: p.name ?? p.fullName ?? 'Mohamed Ibrahim',
          title: p.title ?? 'Software Engineer',
          location: p.links?.location ?? p.location ?? p.locationString ?? '',
          email: p.links?.gmail ?? p.email ?? '',
          phone: p.links?.phone ?? p.phone ?? '',
          resumeUrl: p.links?.cv ?? p.resumeUrl ?? '',
          linkedin: p.links?.linkedin ?? p.linkedin ?? '',
          github: p.links?.github ?? p.github ?? '',
          languages: p.languages ?? p.langs ?? p.languageList ?? [
            { code: 'eg', name: 'Arabic', level: 'Native' },
            { code: 'us', name: 'English', level: 'Fluent' }
          ]
        };

        // Normalize description -> always an array of strings
        let desc: string[] = [];

        if (Array.isArray(p.description)) {
          desc = p.description.map((d: any) => (typeof d === 'string' ? d : String(d)));
        } else if (typeof p.description === 'string') {
          // Try parse in case backend stored JSON stringified array
          try {
            const parsed = JSON.parse(p.description);
            if (Array.isArray(parsed)) {
              desc = parsed.map((d: any) => (typeof d === 'string' ? d : String(d)));
            } else {
              // not an array after parse -> split by newline
              desc = p.description.split('\n').map((s: string) => s.trim()).filter(Boolean);
            }
          } catch {
            // not JSON, split by newline
            desc = p.description.split('\n').map((s: string) => s.trim()).filter(Boolean);
          }
        } else if (p.description == null) {
          desc = []; // empty
        } else {
          // fallback: convert to single-element array
          desc = [String(p.description)];
        }

        normalized.description = desc;
        normalized.photoUrl = p.photoUrl ?? p.imageUrl ?? (p.links?.photo ?? null);

        return normalized;
      }),
      catchError(() =>
        of({
          name: 'Mohamed Ibrahim',
          title: 'Software Engineer & React Developer',
          location: 'Egypt',
          email: 'mohamedelanany@gmail.com',
          phone: '01111349873',
          resumeUrl: '/assets/resume.pdf',
          description: [
            "My journey in software development began with curiosity about how websites work, and it has evolved into a deep passion for creating meaningful digital experiences.",
            "I specialize in full-stack web development, front-end design, and software engineering."
          ],
          languages: [
            { code: 'eg', name: 'Arabic', level: 'Native' },
            { code: 'us', name: 'English', level: 'Fluent' }
          ]
        })
      )
    );
  }

  downloadResume(url?: string) {
    const link = url ?? '/assets/resume.pdf';
    window.open(link, '_blank');
  }
}

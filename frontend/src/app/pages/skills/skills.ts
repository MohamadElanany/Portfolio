// src/app/pages/skills/skills.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { LucideAngularModule } from 'lucide-angular';
import { Api } from '../../services/api';

export interface Skill {
  _id?: string;
  category: 'Front-End' | 'Back-End' | 'Principles and Concepts' | 'Interpersonal Skills' | "Tools & Technologies" | 'Other Programming Languages' | string;
  items: string[];
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './skills.html',
})
export class Skills {
  // observable that resolves to a map: category -> items[]
  skillsMap$!: Observable<Record<string, string[]>>;
  years$!: Observable<string>;

  readonly categoriesOrder = [
    'Front-End',
    'Back-End',
    'Principles and Concepts',
    'Interpersonal Skills',
    "Tools & Technologies",
    'Other Programming Languages'
  ];

  constructor(private api: Api) {
    // cast api.getSkills() to any to avoid strict unknown inference, then map to Record<string,string[]>
    const raw$ = this.api.getSkills() as Observable<any>;

    this.skillsMap$ = raw$.pipe(
      map((res: any) => {
        // fallback map
        const fallbackMap: Record<string, string[]> = {
          'Front-End': [],
          'Back-End': [],
          'Principles and Concepts': [],
          'Interpersonal Skills': [],
          'Tools & Technologies': [],
          'Other Programming Languages': []
        };

        if (!res) return fallbackMap;

        let list: Skill[] = [];

        if (Array.isArray(res)) {
          // expected: [{ _id, category, items }]
          list = res.map((r: any) => ({
            _id: r._id,
            category: r.category ?? 'Other Programming Languages',
            items: Array.isArray(r.items) ? r.items.map((i: any) => i?.toString()) : []
          }));
        } else if (typeof res === 'object') {
          // handle object-shaped responses (e.g., { languages: [], frameworks: [], tools: [] })
          const temp: Skill[] = [];

          if (Array.isArray(res.languages)) temp.push({ category: 'Front-End', items: res.languages.map((i: any) => i?.toString()) });
          if (Array.isArray(res.frameworks)) temp.push({ category: 'Front-End', items: res.frameworks.map((i: any) => i?.toString()) });
          if (Array.isArray(res.tools)) temp.push({ category: 'Tools & Technologies', items: res.tools.map((i: any) => i?.toString()) });

          // also accept if backend returned categories as object keys
          Object.keys(res).forEach(k => {
            if (!['languages','frameworks','tools'].includes(k) && Array.isArray(res[k])) {
              temp.push({ category: k, items: res[k].map((i: any) => i?.toString()) });
            }
          });

          list = temp;
        }

        const map: Record<string, string[]> = {};

        list.forEach(s => {
          const cat = s.category ?? 'Other Programming Languages';
          if (!map[cat]) map[cat] = [];
          map[cat].push(...(s.items ?? []).map(i => i?.toString().trim()));
        });

        // normalize uniques and trim
        Object.keys(map).forEach(cat => {
          map[cat] = Array.from(new Set(map[cat].filter(Boolean)));
        });

        // ensure all ordered categories exist (even empty)
        this.categoriesOrder.forEach(cat => {
          if (!map[cat]) map[cat] = [];
        });

        return map;
      }),
      catchError(() => {
        // fallback values when API fails
        const fallback: Record<string, string[]> = {
          'Front-End': ['HTML', 'CSS', 'JavaScript', 'TypeScript'],
          'Back-End': ['Node.js', 'Express'],
          'Principles and Concepts': ['OOP', 'Data Structures', 'Algorithms'],
          'Interpersonal Skills': ['Teamwork', 'Communication'],
          'Tools & Technologies': ['Git', 'Docker', 'VS Code'],
          'Other Programming Languages': ['Python', 'Java']
        };
        return of(fallback) as any;
      })
    ) as Observable<Record<string, string[]>>;

    // compute years from experience endpoint (unchanged logic)
    this.years$ = this.api.getExperience().pipe(
      map((res: any) => {
        const fallbackText = '1-2 years (including internships and personal projects)';
        if (!res) return fallbackText;

        if (Array.isArray(res) && res.length) {
          const dates = res
            .map((e: any) => e.startDate)
            .filter(Boolean)
            .map((d: string) => new Date(d))
            .filter((d: Date) => !Number.isNaN(d.getTime()));

          if (!dates.length) return fallbackText;

          const earliest = new Date(Math.min(...dates.map(d => d.getTime())));
          const now = new Date();
          const months = (now.getFullYear() - earliest.getFullYear()) * 12 + (now.getMonth() - earliest.getMonth());
          const years = Math.floor(months / 12);

          if (years <= 0) return 'Less than 1 year';
          if (years === 1) return '1 year';
          return `${years} years`;
        }

        if (typeof res === 'object') return res.years ?? res.experienceYears ?? res.summary ?? fallbackText;
        return fallbackText;
      }),
      catchError(() => of('1-2 years (including internships and personal projects)'))
    );
  }
}

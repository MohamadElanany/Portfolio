import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { LucideAngularModule } from 'lucide-angular';
import { Api } from '../../services/api';
import { environment } from '../../../environments/environment';

interface ApiProject {
  _id?: string;
  photoUrl?: string;
  title?: string;
  description?: string;
  tools?: string[];      // backend name
  links?: { demo?: string; repo?: string };
  imageUrl?: string;
  tech?: string[];
  github?: string;
  demo?: string;
}

interface ProjectView {
  id?: string;
  title: string;
  description: string;
  tech: string[];        // used in template
  github?: string;
  demo?: string;
  imageUrl: string;      // src used in template
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './projects.html',
})
export class Projects {
  projects$: Observable<ProjectView[]>;

  constructor(private api: Api) {
    const serverBase = environment.apiUrl.replace(/\/api\/?$/, '');

    this.projects$ = (this.api.getProjects() as Observable<any[]>).pipe(
      map((list: any[]) => {
        if (!Array.isArray(list)) return [];

        return list.map((p: ApiProject) => {
          // resolve image url: backend returns photoUrl (relative like /uploads/..), or imageUrl fallback
          let img = p.photoUrl ?? (p as any).imageUrl ?? '';
          if (img && !/^https?:\/\//.test(img)) {
            img = `${serverBase}${img.startsWith('/') ? '' : '/'}${img}`;
          }
          if (!img) img = 'assets/placeholder.svg';

          // tools/tech normalization — annotate type to avoid implicit any
          const tech: any[] = Array.isArray(p.tools) ? p.tools : (Array.isArray((p as any).tech) ? (p as any).tech : []);

          // links
          const links = p.links ?? {};
          const github = links.repo ?? (p as any).github ?? null;
          const demo = links.demo ?? (p as any).demo ?? null;

          return {
            id: p._id,
            title: p.title ?? 'Untitled project',
            description: p.description ?? '',
            tech: tech.map((t: any) => t?.toString()).filter(Boolean),
            github,
            demo,
            imageUrl: img
          } as ProjectView;
        });
      }),
      catchError(() =>
        of<ProjectView[]>([
          {
            title: 'Task Manager App',
            description: 'A task management tool built using React to help users add, manage, and delete tasks.',
            tech: ['React.js'],
            github: '#',
            demo: '#',
            imageUrl: 'assets/placeholder.svg'
          },
          {
            title: 'Weather App',
            description: 'A real-time weather app that fetches data from an external API.',
            tech: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
            github: '#',
            demo: '#',
            imageUrl: 'assets/placeholder.svg'
          }
        ])
      )
    );
  }
}


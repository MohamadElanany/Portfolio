import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { Api } from '../../../app/services/api';
import { ToastService } from '../../../app/services/toast.service';

@Component({
  selector: 'dash-projects-list',
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe],
  templateUrl: './projects-list.html'
})
export class DashProjectsList {
  projects$!: Observable<any[]>;

  constructor(private api: Api, private toast: ToastService) {
    this.reload();
  }

  reload() {
    this.projects$ = this.api.getProjects() as Observable<any[]>;
  }

  onDelete(id?: string) {
    if (!id) return;
    if (!confirm('Delete this project?')) return;
    this.api.deleteProject(id).subscribe({
      next: () => {
        this.toast.show('Project deleted', 'success');
        this.reload();
      },
      error: (err) => {
        console.error('delete error', err);
        this.toast.show('Failed to delete project', 'error');
      }
    });
  }
}

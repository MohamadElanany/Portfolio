// src/app/dashboard/education/education-list.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { Api } from '../../../app/services/api';
import { ToastService } from '../../../app/services/toast.service';

@Component({
  selector: 'dash-education-list',
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe],
  templateUrl: './education-list.html'
})
export class DashEducationList {
  education$!: Observable<any[]>;

  constructor(private api: Api, private toast: ToastService) {
    this.reload();
  }

  reload() {
    this.education$ = this.api.getEducation() as Observable<any[]>;
  }
  getCourseNames(e: any): string {
    return (e.courses || []).map((c: any) => c.name).join(', ');
  }

  onDelete(id?: string) {
    if (!id) return;
    if (!confirm('Delete this education entry?')) return;
    this.api.deleteEducation(id).subscribe({
      next: () => {
        this.toast.show('Education deleted', 'success');
        this.reload();
      },
      error: (err) => {
        console.error('delete education', err);
        this.toast.show('Failed to delete', 'error');
      }
    });
  }
}

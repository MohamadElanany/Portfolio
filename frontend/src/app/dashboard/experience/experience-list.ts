import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { Api } from '../../../app/services/api';
import { ToastService } from '../../../app/services/toast.service';

@Component({
  selector: 'dash-experience-list',
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe],
  templateUrl: './experience-list.html'
})
export class DashExperienceList {
  experience$!: Observable<any[]>;

  constructor(private api: Api, private toast: ToastService) {
    this.reload();
  }

  reload() {
    this.experience$ = this.api.getExperience() as Observable<any[]>;
  }

  onDelete(id?: string) {
    if (!id) return;
    if (!confirm('Delete this experience?')) return;
    this.api.deleteExperience(id).subscribe({
      next: () => {
        this.toast.show('Experience deleted', 'success');
        this.reload();
      },
      error: (err) => {
        console.error('delete experience', err);
        this.toast.show('Failed to delete', 'error');
      }
    });
  }

  // helper to format period
  period(item: any) {
    const s = item.startDate ? new Date(item.startDate).toLocaleDateString() : '';
    const e = item.endDate ? new Date(item.endDate).toLocaleDateString() : 'Present';
    return s ? `${s} → ${e}` : e;
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { Api } from '../../../app/services/api';
import { ToastService } from '../../../app/services/toast.service';

@Component({
  selector: 'dash-skills-list',
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe],
  templateUrl: './skills-list.html'
})
export class DashSkillsList {
  skills$!: Observable<any[]>;

  constructor(private api: Api, private toast: ToastService) {
    this.reload();
  }

  reload() {
    this.skills$ = this.api.getSkills() as Observable<any[]>;
  }

  onDelete(id?: string) {
    if (!id) return;
    if (!confirm('Delete this skill category?')) return;
    this.api.deleteSkills(id).subscribe({
      next: () => {
        this.toast.show('Skill category deleted', 'success');
        this.reload();
      },
      error: (err) => {
        console.error('delete skill error', err);
        this.toast.show('Failed to delete', 'error');
      }
    });
  }
}

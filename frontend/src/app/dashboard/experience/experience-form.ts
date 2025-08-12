import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

import { Api } from '../../../app/services/api';
import { ToastService } from '../../../app/services/toast.service';

@Component({
  selector: 'dash-experience-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './experience-form.html'
})
export class DashExperienceForm {
  form: FormGroup;
  id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: Api,
    private toast: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      jobTitle: ['', Validators.required],
      company: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''], // optional
      description: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = id;
      this.load(id);
    }
  }

  load(id: string) {
    this.api.getExperience().subscribe({
      next: (res: any) => {
        const list = Array.isArray(res) ? res : [];
        const found = list.find((x: any) => x._id === id) ?? null;
        if (found) {
          // ensure ISO date strings (yyyy-mm-dd) for input[type=date] (trim time if present)
          const sd = found.startDate ? found.startDate.split('T')[0] : '';
          const ed = found.endDate ? found.endDate.split('T')[0] : '';
          this.form.patchValue({
            jobTitle: found.jobTitle ?? '',
            company: found.company ?? '',
            startDate: sd,
            endDate: ed,
            description: found.description ?? ''
          });
        } else {
          this.toast.show('Experience not found', 'error');
        }
      },
      error: (err) => {
        console.error('load experience', err);
        this.toast.show('Failed to load', 'error');
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return this.toast.show('Please complete required fields', 'error');
    }

    const raw = this.form.value as {
      jobTitle?: string;
      company?: string;
      startDate?: string;
      endDate?: string;
      description?: string;
    };

    const payload: any = {
      jobTitle: raw.jobTitle ?? '',
      company: raw.company ?? '',
      startDate: raw.startDate ?? '',
      endDate: raw.endDate ?? null,
      description: raw.description ?? ''
    };

    const req = this.id ? this.api.putExperience(this.id, payload) : this.api.postExperience(payload);
    req.subscribe({
      next: () => {
        this.toast.show('Saved successfully', 'success');
        this.router.navigate(['/yawalad/experience']);
      },
      error: (err) => {
        console.error('save experience', err);
        this.toast.show('Save failed', 'error');
      }
    });
  }
}

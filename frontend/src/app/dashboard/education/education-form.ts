import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

import { Api } from '../../../app/services/api';
import { ToastService } from '../../../app/services/toast.service';

@Component({
  selector: 'dash-education-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './education-form.html'
})
export class DashEducationForm {
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
      degree: ['', Validators.required],
      university: ['', Validators.required],
      year: ['', Validators.required],
      description: [''],
      coursesText: [''] // textarea: each line "Course name - description"
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = id;
      this.load(id);
    }
  }

  load(id: string) {
    this.api.getEducation().subscribe({
      next: (res: any) => {
        const list = Array.isArray(res) ? res : [];
        const found = list.find((x: any) => x._id === id) ?? null;
        if (found) {
          const courses = Array.isArray(found.courses) ? found.courses : [];
          // convert courses to lines "name - description"
          const coursesText = courses.map((c:any) => `${c.name} - ${c.description ?? ''}`).join('\n');
          this.form.patchValue({
            degree: found.degree ?? '',
            university: found.university ?? '',
            year: found.year?.toString() ?? '',
            description: found.description ?? '',
            coursesText
          });
        } else {
          this.toast.show('Education entry not found', 'error');
        }
      },
      error: (err) => {
        console.error('load education', err);
        this.toast.show('Failed to load', 'error');
      }
    });
  }

  private parseCourses(text: string) {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const [name, ...rest] = line.split(' - ');
        return { name: (name ?? '').trim(), description: rest.join(' - ').trim() || '' };
      });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return this.toast.show('Please complete required fields', 'error');
    }

    const raw = this.form.value as {
      degree?: string;
      university?: string;
      year?: string | number;
      description?: string;
      coursesText?: string;
    };

    const payload: any = {
      degree: raw.degree ?? '',
      university: raw.university ?? '',
      year: isNaN(Number(raw.year)) ? raw.year : Number(raw.year),
      description: raw.description ?? '',
      courses: this.parseCourses(raw.coursesText ?? '')
    };

    const req = this.id ? this.api.putEducation(this.id, payload) : this.api.postEducation(payload);
    req.subscribe({
      next: () => {
        this.toast.show('Saved successfully', 'success');
        this.router.navigate(['/yawalad/education']);
      },
      error: (err) => {
        console.error('save education', err);
        this.toast.show('Save failed', 'error');
      }
    });
  }
}

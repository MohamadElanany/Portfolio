import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

import { Api } from '../../../app/services/api';
import { ToastService } from '../../../app/services/toast.service';

type CategoryType =
  | 'Front-End'
  | 'Back-End'
  | 'Principles and Concepts'
  | 'Interpersonal Skills'
  | 'Tools & Technologies'
  | 'Other Programming Languages';

@Component({
  selector: 'dash-skills-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './skills-form.html'
})
export class DashSkillsForm {
  form: FormGroup;
  id: string | null = null;

  categories: CategoryType[] = [
    'Front-End',
    'Back-End',
    'Principles and Concepts',
    'Interpersonal Skills',
    'Tools & Technologies',
    'Other Programming Languages'
  ];

  constructor(
    private fb: FormBuilder,
    private api: Api,
    private toast: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      category: ['', Validators.required],
      items: ['', Validators.required] // comma-separated input
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = id;
      this.load(id);
    }
  }

  load(id: string) {
    this.api.getSkills().subscribe({
      next: (res: any) => {
        // API might return array; find the item by id
        const list = Array.isArray(res) ? res : [];
        const found = list.find((x: any) => x._id === id) ?? null;
        if (found) {
          this.form.patchValue({
            category: found.category ?? '',
            items: (found.items || []).join(', ')
          });
        } else {
          this.toast.show('Skill category not found', 'error');
        }
      },
      error: (err) => {
        console.error('load skills', err);
        this.toast.show('Failed to load', 'error');
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return this.toast.show('Please complete required fields', 'error');
    }

    const raw = this.form.value as { category?: string; items?: string };
    const itemsArr = (raw.items ?? '')
      .toString()
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      category: raw.category,
      items: itemsArr
    };

    if (this.id) {
      this.api.putSkills(this.id, payload).subscribe({
        next: () => {
          this.toast.show('Category updated', 'success');
          this.router.navigate(['/yawalad/skills']);
        },
        error: (err) => {
          console.error('update skill', err);
          this.toast.show('Update failed', 'error');
        }
      });
    } else {
      this.api.postSkills(payload).subscribe({
        next: () => {
          this.toast.show('Category created', 'success');
          this.router.navigate(['/yawalad/skills']);
        },
        error: (err) => {
          console.error('create skill', err);
          this.toast.show('Create failed', 'error');
        }
      });
    }
  }
}

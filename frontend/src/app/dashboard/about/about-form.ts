// src/app/dashboard/about/about-form.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { Api } from '../../../app/services/api';
import { ToastService } from '../../../app/services/toast.service';

@Component({
  selector: 'dash-about-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './about-form.html'
})
export class DashAboutForm {
  form: FormGroup;
  loading = false;
  existingPhotoUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: Api,
    private toast: ToastService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      resumeUrl: [''],
      github: [''],
      linkedin: [''],
      gmail: [''],
      phone: [''],
      location: [''],
      photo: [null] // File
    });

    this.load();
  }

  load() {
    this.loading = true;
    this.api.getProfile().subscribe({
      next: (p: any) => {
        // API might return single object or array; handle safe
        const profile = Array.isArray(p) ? p[0] ?? null : p ?? null;
        if (!profile) {
          this.loading = false;
          return;
        }
        this.existingPhotoUrl = profile.photoUrl ?? null;
        this.form.patchValue({
          name: profile.name ?? '',
          title: profile.title ?? '',
          description: Array.isArray(profile.description) ? profile.description.join('\n') : profile.description ?? '',
          resumeUrl: profile.links?.cv ?? profile.resumeUrl ?? '',
          github: profile.links?.github ?? '',
          linkedin: profile.links?.linkedin ?? '',
          gmail: profile.links?.gmail ?? profile.email ?? '',
          phone: profile.links?.phone ?? profile.phone ?? '',
          location: profile.links?.location ?? profile.location ?? ''
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('load profile', err);
        this.toast.show('Failed to load profile', 'error');
        this.loading = false;
      }
    });
  }

  onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const f = input.files?.[0] ?? null;
    this.form.patchValue({ photo: f });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return this.toast.show('Please complete required fields', 'error');
    }

    const raw = this.form.value as any;
    // If you want to send description as array, split lines
    const descriptionArr = (raw.description ?? '').toString().split('\n').map((s:string)=>s.trim()).filter(Boolean);

    const fd = new FormData();
    fd.append('title', raw.title ?? '');
    // fd.append('description', JSON.stringify(descriptionArr));
    fd.append('description', descriptionArr.join('\n'));
    fd.append('links', JSON.stringify({
      cv: raw.resumeUrl ?? '',
      github: raw.github ?? '',
      linkedin: raw.linkedin ?? '',
      gmail: raw.gmail ?? '',
      phone: raw.phone ?? '',
      location: raw.location ?? ''
    }));
    fd.append('name', raw.name ?? '');

    if (raw.photo instanceof File) {
      fd.append('photo', raw.photo, raw.photo.name);
    }

    this.api.postProfile(fd).subscribe({
      next: () => {
        this.toast.show('Profile saved', 'success');
        // optional: reload
        this.load();
        // navigate back to dashboard root or stay
      },
      error: (err) => {
        console.error('save profile', err);
        this.toast.show('Save failed', 'error');
      }
    });
  }
}

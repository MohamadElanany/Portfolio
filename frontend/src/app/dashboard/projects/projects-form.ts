import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

import { Api } from '../../../app/services/api';
import { ToastService } from '../../../app/services/toast.service';

@Component({
  selector: 'dash-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './projects-form.html'
})
export class DashProjectForm {
  form: FormGroup;
  id: string | null = null;
  existingImageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: Api,
    private toast: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // init form here (after fb is available)
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      tools: [''],
      demo: [''],
      repo: [''],
      photo: [null] // will hold File or null
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = id;
      this.load(id);
    }
  }

  load(id: string): void {
    this.api.getProject(id).subscribe({
      next: (p: any) => {
        this.form.patchValue({
          title: p.title ?? '',
          description: p.description ?? '',
          tools: (p.tools || p.tech || []).join(', '),
          demo: p.links?.demo ?? p.demo ?? '',
          repo: p.links?.repo ?? p.github ?? ''
        });
        this.existingImageUrl = p.photoUrl ?? p.imageUrl ?? null;
      },
      error: (err) => {
        console.error('load project error', err);
        this.toast.show('Failed to load project', 'error');
      }
    });
  }

  onFileChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    const f = input.files?.[0] ?? null;
    this.form.patchValue({ photo: f });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show('Please fill required fields', 'error');
      return;
    }

    const raw = this.form.value as {
      title?: string;
      description?: string;
      tools?: string;
      demo?: string;
      repo?: string;
      photo?: File | null;
    };

    const fd = new FormData();

    // ensure strings (avoid undefined)
    fd.append('title', raw.title ?? '');
    fd.append('description', raw.description ?? '');

    // append photo only if File present
    if (raw.photo instanceof File) {
      fd.append('photo', raw.photo, raw.photo.name);
    }

    // tools as JSON array
    const toolsArr = (raw.tools ?? '').toString()
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    fd.append('tools', JSON.stringify(toolsArr));

    // links object
    const links = {
      demo: raw.demo ?? '',
      repo: raw.repo ?? ''
    };
    fd.append('links', JSON.stringify(links));

    const req = this.id ? this.api.putProject(this.id, fd) : this.api.postProject(fd);

    req.subscribe({
      next: () => {
        this.toast.show('Saved successfully', 'success');
        this.router.navigate(['/yawalad/projects']);
      },
      error: (err) => {
        console.error('save project error', err);
        this.toast.show('Save failed', 'error');
      }
    });
  }
}

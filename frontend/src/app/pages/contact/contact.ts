// src/app/pages/contact/contact.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from '../../services/api';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule
  ],
  templateUrl: './contact.html'
})
export class Contact {
  form!: FormGroup;
  submitting = false;
  resultMessage = '';

  constructor(private fb: FormBuilder, private api: Api) {
    // init form after fb is available
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.api.postMessage(this.form.value).subscribe({
      next: () => {
        this.resultMessage = 'Message sent — thanks!';
        this.form.reset();
        this.submitting = false;
      },
      error: () => {
        this.resultMessage = 'Failed to send message. Try again later.';
        this.submitting = false;
      }
    });
  }
}

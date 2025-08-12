// src/app/dashboard/messages/messages-list.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Api } from '../../../app/services/api';
import { ToastService } from '../../../app/services/toast.service';

@Component({
  selector: 'dash-messages-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './messages-list.html'
})
export class DashMessagesList {
  messages: any[] = [];
  loading = false;
  lastError: string | null = null;

  constructor(private api: Api, private toast: ToastService) {
    this.reload();
  }

  reload() {
    this.loading = true;
    this.lastError = null;
    this.api.getMessages().subscribe({
      next: (res: any) => {
        // Normalize response shapes
        if (Array.isArray(res)) {
          this.messages = res;
        } else if (res == null) {
          this.messages = [];
        } else if (Array.isArray(res.data)) {
          this.messages = res.data;
        } else if (Array.isArray(res.messages)) {
          this.messages = res.messages;
        } else {
          // try find first array value
          const maybeArray = Object.values(res).find(v => Array.isArray(v));
          this.messages = Array.isArray(maybeArray) ? maybeArray as any[] : [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('getMessages error', err);
        this.lastError = err?.message ?? 'Failed to fetch messages';
        this.toast.show('Failed to load messages', 'error');
        this.messages = [];
        this.loading = false;
      }
    });
  }

  onDelete(id?: string) {
    if (!id) return;
    if (!confirm('Delete this message?')) return;
    this.api.deleteMessage(id).subscribe({
      next: () => {
        this.toast.show('Message deleted', 'success');
        // بعد الحذف نعيد الجلب
        this.reload();
      },
      error: (err) => {
        console.error('delete message', err);
        this.toast.show('Failed to delete', 'error');
      }
    });
  }
}

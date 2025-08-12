import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type?: ToastType;
  timeout?: number; // ms
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts: Toast[] = [];
  private subj = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.subj.asObservable();

  show(message: string, type: ToastType = 'info', timeout = 3500) {
    const t: Toast = { id: Math.random().toString(36).slice(2), message, type, timeout };
    this.toasts.push(t);
    this.subj.next([...this.toasts]);

    // auto-remove
    setTimeout(() => this.remove(t.id), timeout);
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.subj.next([...this.toasts]);
  }

  clear() {
    this.toasts = [];
    this.subj.next([]);
  }
}

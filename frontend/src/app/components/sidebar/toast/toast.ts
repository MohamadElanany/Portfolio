// src/app/components/toast/toast.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  template: `
    <div class="toasts-wrapper" *ngIf="toastSvc.toasts$ | async as toasts">
      <div *ngFor="let t of toasts" class="toast" [ngClass]="t.type">
        <div class="toast-message">{{ t.message }}</div>
        <button class="toast-close" (click)="toastSvc.remove(t.id)">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toasts-wrapper {
      position: fixed;
      right: 18px;
      bottom: 18px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      z-index: 9999;
      max-width: calc(100% - 40px);
    }
    .toast {
      min-width: 200px;
      padding: 0.6rem 0.8rem;
      border-radius: 8px;
      box-shadow: 0 8px 18px rgba(0,0,0,0.12);
      background: #fff;
      color: #111;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      border: 1px solid rgba(0,0,0,0.06);
      font-weight: 500;
    }
    .toast.info { background: #f1f5f9; color: #0f172a; }
    .toast.success { background: #ecfdf5; color: #065f46; border-color: rgba(6,95,70,0.08); }
    .toast.error { background: #fff1f2; color: #7f1d1d; border-color: rgba(127,29,29,0.08); }
    .toast-close {
      background: transparent;
      border: none;
      font-size: 1.1rem;
      line-height: 1;
      cursor: pointer;
    }
    @media(max-width:600px){
      .toasts-wrapper { left: 12px; right: 12px; top: auto; bottom: 12px; }
      .toast { min-width: auto; }
    }
  `]
})
export class ToastComponent {
  constructor(public toastSvc: ToastService) {}
}

// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ToastService } from '../../../services/toast.service';

// @Component({
//   selector: 'app-test-toast-button',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <div style="position:fixed; left:18px; bottom:18px; z-index:9998;">
//       <button (click)="showInfo()" style="margin-right:6px;padding:8px 10px;border-radius:6px;">Show info</button>
//       <button (click)="showSuccess()" style="margin-right:6px;padding:8px 10px;border-radius:6px;background:#10b981;color:#fff;">Show success</button>
//       <button (click)="showError()" style="padding:8px 10px;border-radius:6px;background:#ef4444;color:#fff;">Show error</button>
//     </div>
//   `
// })
// export class TestToastButtonComponent {
//   constructor(private toast: ToastService) {}

//   showInfo() { this.toast.show('This is an info toast', 'info'); }
//   showSuccess() { this.toast.show('Saved successfully', 'success'); }
//   showError() { this.toast.show('An error occurred', 'error'); }
// }

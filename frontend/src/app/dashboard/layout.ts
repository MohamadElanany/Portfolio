import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-root" style="min-height:100vh;display:flex;gap:1rem;padding:1.5rem">
      <aside style="width:240px;background:var(--card);border:1px solid var(--border);padding:1rem;border-radius:8px;">
        <h3 style="margin-top:0">Dashboard</h3>

        <nav>
          <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px">
            <li><a routerLink="/yawalad" routerLinkActive="active">Overview</a></li>
            <li><a routerLink="/yawalad/about" routerLinkActive="active">About</a></li>
            <li><a routerLink="/yawalad/skills" routerLinkActive="active">Skills</a></li>
            <li><a routerLink="/yawalad/projects" routerLinkActive="active">Projects</a></li>
            <li><a routerLink="/yawalad/experience" routerLinkActive="active">Experience</a></li>
            <li><a routerLink="/yawalad/education" routerLinkActive="active">Education</a></li>
            <li><a routerLink="/yawalad/messages" routerLinkActive="active">Messages</a></li>
          </ul>
        </nav>
      </aside>

      <main style="flex:1;min-width:0">
        <div style="background:var(--card);border:1px solid var(--border);padding:1rem;border-radius:8px;margin-bottom:1rem">
          <strong>Admin panel</strong> — Manage your portfolio content here.
        </div>

        <div>
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class DashboardLayout {}

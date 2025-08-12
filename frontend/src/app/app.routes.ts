// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { About } from './pages/about/about';
import { Skills } from './pages/skills/skills';
import { Projects } from './pages/projects/projects';
import { ExperienceComponent } from './pages/experience/experience';
import { Contact } from './pages/contact/contact';
import { EducationComponent } from './pages/education/education';
import { DashboardLayout } from './dashboard/layout';
import { DashProjectsList } from './dashboard/projects/projects-list';
import { DashProjectForm } from './dashboard/projects/projects-form';
import { DashSkillsList } from './dashboard/skills/skills-list';
import { DashSkillsForm } from './dashboard/skills/skills-form';
import { DashExperienceList } from './dashboard/experience/experience-list';
import { DashExperienceForm } from './dashboard/experience/experience-form';
import { DashEducationList } from './dashboard/education/education-list';
import { DashEducationForm } from './dashboard/education/education-form';
import { DashAboutForm } from './dashboard/about/about-form';
import { DashMessagesList } from './dashboard/about/messages-list';



export const routes: Routes = [
  { path: '', component: About },
  { path: 'skills', component: Skills },
  { path: 'projects', component: Projects },
  { path: 'experience', component: ExperienceComponent },
  { path: 'education', component: EducationComponent },
  { path: 'contact', component: Contact },
  {path: 'yawalad',
  component: DashboardLayout,
  children: [
    { path: '', redirectTo: 'projects', pathMatch: 'full' },
    { path: 'projects', component: DashProjectsList },
    { path: 'projects/new', component: DashProjectForm },
    { path: 'projects/:id', component: DashProjectForm },
    { path: 'skills', component: DashSkillsList },
    { path: 'skills/new', component: DashSkillsForm },
    { path: 'skills/:id', component: DashSkillsForm },
    { path: 'experience', component: DashExperienceList },
    { path: 'experience/new', component: DashExperienceForm },
    { path: 'experience/:id', component: DashExperienceForm },
    { path: 'education', component: DashEducationList },
    { path: 'education/new', component: DashEducationForm },
    { path: 'education/:id', component: DashEducationForm },
    { path: 'about', component: DashAboutForm },
    { path: 'messages', component: DashMessagesList },

  ]},
  { path: '**', redirectTo: '' }
];

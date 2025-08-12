import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar'; // standalone sidebar
import { ToastComponent } from './components/sidebar/toast/toast';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Sidebar, ToastComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}


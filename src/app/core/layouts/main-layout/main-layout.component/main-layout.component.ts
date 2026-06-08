import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { AuthService } from '../../../../features/auth/services/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private router = inject(Router);
  private readonly authService = inject(AuthService);

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

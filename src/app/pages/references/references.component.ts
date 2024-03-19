import { HeaderComponent } from '@/app/components/header/header.component';
import { UserLoginComponent } from '@/app/components/user-login/user-login.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-references',
  standalone: true,
  imports: [HeaderComponent, UserLoginComponent],
  templateUrl: './references.component.html',
  styleUrl: './references.component.css',
})
export class ReferencesComponent {}

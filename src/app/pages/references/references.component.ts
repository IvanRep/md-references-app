import { HeaderComponent } from '@/app/components/header/header.component';
import { ReferenceComponent } from '@/app/components/reference/reference.component';
import { UserLoginComponent } from '@/app/components/user-login/user-login.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-references',
  standalone: true,
  imports: [HeaderComponent, UserLoginComponent, ReferenceComponent],
  templateUrl: './references.component.html',
  styleUrl: './references.component.css',
})
export class ReferencesComponent {}

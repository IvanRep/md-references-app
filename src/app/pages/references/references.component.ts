import { HeaderComponent } from '@/app/components/header/header.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-references',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './references.component.html',
  styleUrl: './references.component.css',
})
export class ReferencesComponent {}

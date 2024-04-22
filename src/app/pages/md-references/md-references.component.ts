import { EditorComponent } from '@/app/components/editor/editor.component';
import { HeaderComponent } from '@/app/components/header/header.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-md-references',
  standalone: true,
  imports: [HeaderComponent, EditorComponent],
  templateUrl: './md-references.component.html',
  styleUrl: './md-references.component.css',
})
export class MdReferencesComponent {}

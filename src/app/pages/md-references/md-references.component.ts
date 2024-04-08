import { EditorComponent } from '@/app/components/editor/editor.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-md-references',
  standalone: true,
  imports: [EditorComponent],
  templateUrl: './md-references.component.html',
  styleUrl: './md-references.component.css',
})
export class MdReferencesComponent {}

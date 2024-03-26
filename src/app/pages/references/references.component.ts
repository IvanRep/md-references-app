import { HeaderComponent } from '@/app/components/header/header.component';
import { ReferenceListComponent } from '@/app/components/reference-list/reference-list.component';
import { UserLoginComponent } from '@/app/components/user-login/user-login.component';
import { MarkdownService } from '@/app/services/markdown.service';
import { Reference } from '@/app/types/Reference';
import { AsyncPipe } from '@angular/common';
import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-references',
  standalone: true,
  imports: [
    HeaderComponent,
    UserLoginComponent,
    ReferenceListComponent,
    AsyncPipe,
  ],
  templateUrl: './references.component.html',
  styleUrl: './references.component.css',
})
export class ReferencesComponent implements OnChanges {
  referenceList: Observable<Reference[]> = this.markdownService.referenceList$;

  constructor(private markdownService: MarkdownService) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}

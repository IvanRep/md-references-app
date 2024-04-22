import { EditorComponent } from '@/app/components/editor/editor.component';
import { HeaderComponent } from '@/app/components/header/header.component';
import { MarkdownService } from '@/app/services/markdown.service';
import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-md-references',
  standalone: true,
  imports: [HeaderComponent, EditorComponent],
  templateUrl: './md-references.component.html',
  styleUrl: './md-references.component.css',
})
export class MdReferencesComponent implements AfterViewInit {
  markdownText: string = '';

  constructor(private markdownService: MarkdownService) {}

  ngAfterViewInit(): void {
    this.markdownService.markdownFile.subscribe((file: File | undefined) => {
      if (!file) return;
      file.text().then((text: string) => {
        this.markdownText = text;
      });
    });
  }
}

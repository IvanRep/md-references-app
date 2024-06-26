import { EditorComponent } from '@/app/components/editor/editor.component';
import { HeaderComponent } from '@/app/components/header/header.component';
import { MarkdownService } from '@/app/services/markdown.service';
import { AfterViewInit, Component } from '@angular/core';
import { NgxMdEditorComponent } from 'ngx-md-editor';

@Component({
  selector: 'app-md-references',
  standalone: true,
  imports: [HeaderComponent, EditorComponent, NgxMdEditorComponent],
  templateUrl: './md-references.component.html',
  styleUrl: './md-references.component.css',
})
export class MdReferencesComponent implements AfterViewInit {
  markdownText: string = '';

  constructor(private markdownService: MarkdownService) {}

  ngAfterViewInit(): void {
    this.markdownService.markdownFile?.text().then((text: string) => {
      this.markdownText = text;
    });

    this.markdownService.markdownFileSubject.subscribe(
      (file: File | undefined) => {
        if (!file) return;
        file.text().then((text: string) => {
          this.markdownText = text;
        });
      }
    );
  }
}

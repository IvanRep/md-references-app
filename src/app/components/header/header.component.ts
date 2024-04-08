import { CodeComponent } from '@/app/icons/code/code.component';
import { FolderComponent } from '@/app/icons/folder/folder.component';
import { SearchComponent } from '@/app/icons/search/search.component';
import { Component, ErrorHandler, HostListener, OnInit } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { MarkdownService } from '@/app/services/markdown.service';
import { TypedError } from '@/app/error/TypedError';
import { Reference } from '@/app/types/Reference';
import { throwError } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FolderComponent, SearchBarComponent, CodeComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(private markdownService: MarkdownService) {}

  @HostListener('document:dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  @HostListener('document:drop', ['$event']) onDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (!file || !file.name.endsWith('.md'))
      throw new TypedError(
        'Archivo no válido. Introduce un archivo .md',
        'error'
      );

    this.markdownService.setMarkdown(file);
    console.log(file);
  }

  getMarkdown() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md';

    input.onchange = () => {
      if (
        !input.files ||
        input.files.length === 0 ||
        !input.files[0].name.endsWith('.md')
      )
        return;
      this.markdownService.setMarkdown(input.files[0]);
    };
    input.click();
  }
}

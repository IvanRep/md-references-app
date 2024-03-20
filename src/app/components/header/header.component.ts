import { CodeComponent } from '@/app/icons/code/code.component';
import { FolderComponent } from '@/app/icons/folder/folder.component';
import { SearchComponent } from '@/app/icons/search/search.component';
import { Component } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { MarkdownService } from '@/app/services/markdown.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FolderComponent, SearchBarComponent, CodeComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(private markdownService: MarkdownService) {}
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

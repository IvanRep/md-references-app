import { CodeComponent } from '@/app/icons/code/code.component';
import { FolderComponent } from '@/app/icons/folder/folder.component';
import { SearchComponent } from '@/app/icons/search/search.component';
import { Component } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FolderComponent, SearchBarComponent, CodeComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {}

import { SearchComponent } from '@/app/icons/search/search.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [SearchComponent],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  value: string = '';

  onInput(event: Event) {}
}

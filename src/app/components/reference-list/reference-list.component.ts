import { Component, Input } from '@angular/core';
import { type Reference } from '@/app/types/Reference';
import { ReferenceComponent } from '@/app/components/reference/reference.component';

@Component({
  selector: 'app-reference-list',
  standalone: true,
  imports: [ReferenceComponent],
  templateUrl: './reference-list.component.html',
  styleUrl: './reference-list.component.css',
})
export class ReferenceListComponent {
  @Input() referencesList: Reference[] | null = [
    {
      name: 'Deportes Mazarracin',
      place: 'PI. Esparto, 5, 28341 Valdemoro, Madrid, España',
      category: 'Churros de piscina',
      phone: '912 48 08 73',
      website: 'https://www.deportesmazarracin.com/',
    },
    {
      name: 'Deportes Mazarracin',
      place: 'PI. Esparto, 5, 28341 Valdemoro, Madrid, España',
      category: 'Churros de piscina',
      phone: '912 48 08 73',
      website: 'https://www.deportesmazarracin.com/',
    },
    {
      name: 'Deportes Mazarracin',
      place: 'PI. Esparto, 5, 28341 Valdemoro, Madrid, España',
      category: 'Churros de piscina',
      phone: '912 48 08 73',
      website: 'https://www.deportesmazarracin.com/',
    },
    {
      name: 'Deportes Mazarracin',
      place: 'PI. Esparto, 5, 28341 Valdemoro, Madrid, España',
      category: 'Churros de piscina',
      phone: '912 48 08 73',
      website: 'https://www.deportesmazarracin.com/',
    },
    {
      name: 'Deportes Mazarracin',
      place: 'PI. Esparto, 5, 28341 Valdemoro, Madrid, España',
      category: 'Churros de piscina',
      phone: '912 48 08 73',
      website: 'https://www.deportesmazarracin.com/',
    },
  ];
}

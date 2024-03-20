import { Component, HostListener, Input } from '@angular/core';
import { type Reference } from '@/app/types/Reference';
import { type ContextMenuModel } from '@/app/types/ContextMenuModel';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reference',
  standalone: true,
  imports: [CommonModule, ContextMenuComponent],
  templateUrl: './reference.component.html',
  styleUrl: './reference.component.css',
})
export class ReferenceComponent {
  @Input() reference: Reference = {
    name: 'Deportes Mazarracin',
    place: 'PI. Esparto, 5, 28341 Valdemoro, Madrid, España',
    category: 'Churros de piscina',
    phone: '912 48 08 73',
    website: 'https://www.deportesmazarracin.com/',
  };

  // Handle Context Menu -------------------------------------------------------------------------------------

  isDisplayContextMenu: boolean = false;
  rightClickMenuItems: Array<ContextMenuModel> = [];
  rightClickMenuPosition: { x: number; y: number } = { x: 0, y: 0 };

  displayContextMenu(event: MouseEvent) {
    this.isDisplayContextMenu = true;

    this.rightClickMenuItems = [
      {
        menuText: 'Ver sitio web',
        action: () => {
          window.open(this.reference.website);
        },
      },
      {
        menuText: 'Ver ubicación',
        action: () => {
          window.open(
            'https://www.google.com/maps/place/' + this.reference.place
          );
        },
      },
      {
        menuText: 'Copiar Nombre',
        action: () => {
          navigator.clipboard.writeText(this.reference.name);
        },
      },
      {
        menuText: 'Copiar teléfono',
        action: () => {
          navigator.clipboard.writeText(this.reference.phone);
        },
      },
      {
        menuText: 'Copiar ubicación',
        action: () => {
          navigator.clipboard.writeText(this.reference.place);
        },
      },
      {
        menuText: 'Eliminar',
        action: () => {
          alert('Eliminar');
        },
      },
    ];

    this.rightClickMenuPosition = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  getRightClickMenuStyle() {
    return this.rightClickMenuPosition;
  }

  @HostListener('document:click')
  documentClick(): void {
    this.isDisplayContextMenu = false;
  }
}

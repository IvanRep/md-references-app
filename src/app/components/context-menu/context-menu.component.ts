import { ContextMenuModel } from '@/app/types/ContextMenuModel';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.css',
})
export class ContextMenuComponent implements OnChanges {
  constructor(private elRef: ElementRef) {}
  @Input() menuPosition: { x: number; y: number } = { x: 0, y: 0 };
  @Output() outLimits = new EventEmitter<number>();

  ngOnChanges(): void {
    if (!this.elRef) return;

    this.elRef.nativeElement.style.left = `${this.menuPosition.x}px`;
    this.elRef.nativeElement.style.top = `${this.menuPosition.y}px`;
    const dimensions = (
      this.elRef.nativeElement as HTMLDivElement
    ).getBoundingClientRect();

    const windowWidth = document.documentElement.clientWidth;
    const windowHeight = document.documentElement.clientHeight;

    if (dimensions.left + dimensions.width > windowWidth) {
      (this.elRef.nativeElement as HTMLDivElement).style.left = `${
        windowWidth - dimensions.width
      }px`;
    }
    if (dimensions.top + dimensions.height > windowHeight) {
      (this.elRef.nativeElement as HTMLDivElement).style.top = `${
        windowHeight - dimensions.height
      }px`;
    }
  }

  @Input() contextMenuItems: Array<ContextMenuModel> = [];

  onClick(fun: Function) {
    console.log('click');
    fun();
  }
}

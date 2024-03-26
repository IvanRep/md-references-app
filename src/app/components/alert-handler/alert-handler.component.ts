import { Message } from '@/app/types/Message';
import { CodeComponent } from '@/app/icons/code/code.component';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { LoadSvgDirective } from '@/app/directives/loadSvg.directive';

@Component({
  selector: 'app-alert-handler',
  standalone: true,
  imports: [LoadSvgDirective],
  templateUrl: './alert-handler.component.html',
  styleUrl: './alert-handler.component.css',
})
export class AlertHandlerComponent implements OnChanges {
  @Input() message!: Message | null;
  @Input() duration = 3000;
  @ViewChild('alert') alert!: ElementRef;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.alert) {
      const alert = this.alert.nativeElement;

      alert.style.display = 'flex';
      setTimeout(() => {
        alert.style.display = 'none';
      }, this.duration);
    }
  }
}

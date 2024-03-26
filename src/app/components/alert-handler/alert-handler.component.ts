import { Message } from '@/app/types/Message';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-alert-handler',
  standalone: true,
  imports: [],
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

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-login-input',
  standalone: true,
  imports: [],
  templateUrl: './login-input.component.html',
  styleUrl: './login-input.component.css',
})
export class LoginInputComponent {
  @Input() label: string = '';
  @Output() valueChange = new EventEmitter<string>();
  value: string = '';

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.valueChange.emit(this.value);
  }

  focusController(labelElement: HTMLLabelElement) {
    if (labelElement.classList.contains('focus') && this.value === '')
      labelElement.classList.remove('focus');
    else labelElement.classList.add('focus');
  }
}

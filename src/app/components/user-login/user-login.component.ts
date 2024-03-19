import { UserComponent } from '@/app/icons/user/user.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoginInputComponent } from '../login-input/login-input.component';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, UserComponent, LoginInputComponent],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css',
})
export class UserLoginComponent {
  open: boolean = false;

  username: string = 'Nombre de usuario';
  password: string = '';

  toggleButton() {
    this.open = !this.open;
  }

  onSubmit(e: SubmitEvent) {
    e.preventDefault();
    console.log(this.username, this.password);
  }
}

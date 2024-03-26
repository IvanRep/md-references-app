import { Component, ErrorHandler, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalErrorHandler } from './error/global-error-handler';
import { AlertHandlerComponent } from './components/alert-handler/alert-handler.component';
import { Observable, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MessagesDisplayService } from './services/messages-display.service';
import { Message } from '@/app/types/Message';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AlertHandlerComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }],
})
export class AppComponent {
  constructor(private messagesDisplayService: MessagesDisplayService) {}

  title = 'md-references-app';
  alertMessage: Observable<Message> = this.messagesDisplayService.subject;
}

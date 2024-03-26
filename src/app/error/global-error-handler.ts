import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MessagesDisplayService } from '@/app/services/messages-display.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private zone: NgZone,
    private messagesDisplayService: MessagesDisplayService
  ) {}

  handleError(error: Error): void {
    this.zone.run(() => {
      this.messagesDisplayService.subject.next(error.message);
      console.log(error.stack);
    });
  }
}

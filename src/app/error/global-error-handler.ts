import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MessagesDisplayService } from '@/app/services/messages-display.service';
import { TypedError } from '@/app/error/TypedError';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private zone: NgZone,
    private messagesDisplayService: MessagesDisplayService
  ) {}

  handleError(error: TypedError): void {
    this.zone.run(() => {
      this.messagesDisplayService.subject.next({
        message: error.message,
        type: error.type,
      });
      console.log(error.stack);
    });
  }
}

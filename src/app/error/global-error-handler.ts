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
    console.error(error);
    this.zone.run(() => {
      this.messagesDisplayService.subject.next({
        message: error.message,
        type: error.type,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ff2825" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>`,
      });
    });
  }
}

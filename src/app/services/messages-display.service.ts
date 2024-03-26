import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Message } from '@/app/types/Message';

@Injectable({
  providedIn: 'root',
})
export class MessagesDisplayService {
  subject: Subject<Message> = new Subject<Message>();

  constructor() {}
}

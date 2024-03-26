import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagesDisplayService {
  subject: Subject<any> = new Subject<any>();

  constructor() {}
}

import { Component, ErrorHandler, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalErrorHandler } from './error/global-error-handler';
import { AlertHandlerComponent } from './components/alert-handler/alert-handler.component';
import { Observable, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MessagesDisplayService } from './services/messages-display.service';
import { Message } from '@/app/types/Message';
import { MarkdownService } from './services/markdown.service';
import { Reference } from './types/Reference';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AlertHandlerComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }],
})
export class AppComponent implements OnInit {
  constructor(
    private messagesDisplayService: MessagesDisplayService,
    private markdownService: MarkdownService
  ) {}
  ngOnInit(): void {
    this.markdownService.referenceList$.subscribe((references) =>
      this.checkReferences(references)
    );
  }

  title = 'md-references-app';
  alertMessage: Observable<Message> = this.messagesDisplayService.subject;

  checkReferences(referenceList: Reference[]) {
    if (referenceList.length === 0) {
      this.messagesDisplayService.subject.next({
        message: `No se encontro ninguna ubicación, edita el archivo con
        <svg width='100%' height='100%' viewBox='0 0 41 41' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M34.5938 3.84375H6.40625C4.28341 3.84375 2.5625 5.56466 2.5625 7.6875V33.3125C2.5625 35.4353 4.28341 37.1562 6.40625 37.1562H34.5938C36.7166 37.1562 38.4375 35.4353 38.4375 33.3125V7.6875C38.4375 5.56466 36.7166 3.84375 34.5938 3.84375Z' stroke='black' stroke-width='4' stroke-linejoin='round'/><path d='M7.6875 8.96875L14.0938 14.0938L7.6875 19.2188M15.375 19.2188H20.5' stroke='black' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/></svg>
        .
        `,
        type: 'info',
      });
    } else {
      this.messagesDisplayService.subject.next({
        message: `Markdown añadido correctamente`,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-checks" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#00b341" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"/> <path d="M7 12l5 5l10 -10" /><path d="M2 12l5 5m5 -5l5 -5" /></svg>`,
        type: 'success',
      });
    }
  }
}

import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import * as ace from 'ace-builds';
import chaosTheme from 'ace-builds/src-noconflict/theme-chaos';
import markdownMode from 'ace-builds/src-noconflict/mode-markdown';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
})
export class EditorComponent implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}

  @ViewChild('editor') editor!: ElementRef;
  selectedTextIndex: number[] = [0, 0];

  ngAfterViewInit(): void {
    // ace.config.setModuleUrl('ace/theme/chaos', chaosTheme.url);
    // ace.config.setModuleUrl('ace/mode/markdown', markdownMode.url);
    // const aceEditor = ace.edit(this.elementRef.nativeElement);
    // aceEditor.setTheme('ace/theme/chaos');
    // aceEditor.session.setMode('ace/mode/markdown');
    // aceEditor.on('change', () => {
    //   console.log(aceEditor.getValue());
    // });
    // const hiddenEditor = this.elementRef.nativeElement.querySelector(
    //   'textarea.hidden-text'
    // ) as HTMLTextAreaElement;
    // hiddenEditor.addEventListener('keydown', this.removeHighlight.bind(this), {
    //   capture: true,
    // });
  }

  focusEditor() {
    const visibleEditor = this.elementRef.nativeElement.querySelector(
      'div.visible-text'
    ) as HTMLDivElement;
    const hiddenEditor = this.elementRef.nativeElement.querySelector(
      'textarea.hidden-text'
    ) as HTMLTextAreaElement;

    let greaterNumber: number;
    let lesserNumber: number;
    let direction: 'forward' | 'backward' | undefined;
    if (this.selectedTextIndex[0] === this.selectedTextIndex[1]) {
      lesserNumber = this.selectedTextIndex[0];
      greaterNumber = this.selectedTextIndex[0];
      direction = undefined;
    } else if (this.selectedTextIndex[0] < this.selectedTextIndex[1]) {
      lesserNumber = this.selectedTextIndex[0];
      greaterNumber = this.selectedTextIndex[1] + 1;
      direction = 'forward';
    } else {
      lesserNumber = this.selectedTextIndex[1];
      greaterNumber = this.selectedTextIndex[0] + 1;
      direction = 'backward';
    }

    hiddenEditor.focus();
    hiddenEditor.setSelectionRange(lesserNumber, greaterNumber, direction);

    if (visibleEditor.textContent === '') {
      this.writeText({ target: hiddenEditor });
    }
  }

  writeText(event: any) {
    const hiddenEditor = event.target as HTMLTextAreaElement;
    const visibleEditor = this.elementRef.nativeElement.querySelector(
      'div.visible-text'
    ) as HTMLDivElement;
    // visibleEditor.value = hiddenEditor.value;

    visibleEditor.innerHTML = '';
    const angularId = visibleEditor.attributes[0];
    let row = this.createEditorRow(visibleEditor, angularId);
    for (let i = 0; i < hiddenEditor.value.length; i++) {
      const letter = hiddenEditor.value.charAt(i);
      if (letter === '\n') {
        const lastLetterSlot = i;
        const span = this.createEditorLetter(
          row,
          angularId,
          '',
          lastLetterSlot.toString()
        );
        row.slot = lastLetterSlot.toString();
        row = this.createEditorRow(visibleEditor, angularId);
        continue;
      }
      let letterSelected;
      if (hiddenEditor.selectionEnd === i) letterSelected = true;
      const slot = i.toString();
      const span = this.createEditorLetter(
        row,
        angularId,
        letter,
        slot,
        letterSelected
      );
    }
    row.slot = hiddenEditor.value.length.toString();

    const span = this.createEditorLetter(
      row,
      angularId,
      '',
      hiddenEditor.value.length.toString(),
      true
    );
  }

  createEditorLetter(
    row: HTMLDivElement,
    angularId: Attr,
    letter: string,
    slot: string,
    selected: boolean = false
  ) {
    const span = document.createElement('span');
    span.setAttribute(angularId.name, angularId.value);
    if (selected) span.classList.add('selected');
    span.textContent = letter;
    span.slot = slot;
    span.addEventListener('mousedown', this.getStartTextSelection.bind(this));
    span.addEventListener('mouseup', this.getEndTextSelection.bind(this));
    row.appendChild(span);
    return span;
  }

  createEditorRow(editor: HTMLDivElement, angularId: Attr) {
    let row = document.createElement('div');
    row.classList.add('row');
    row.setAttribute(angularId.name, angularId.value);
    row.addEventListener('mousedown', this.getStartRowSelection.bind(this));
    row.addEventListener('mouseup', this.getEndRowSelection.bind(this));
    editor.appendChild(row);
    return row;
  }

  addHighlight() {
    this.elementRef.nativeElement
      .querySelectorAll('span')
      .forEach((span: HTMLSpanElement) => {
        if (
          (parseInt(span.slot) >= this.selectedTextIndex[0] &&
            parseInt(span.slot) <= this.selectedTextIndex[1]) ||
          (parseInt(span.slot) >= this.selectedTextIndex[1] &&
            parseInt(span.slot) <= this.selectedTextIndex[0])
        ) {
          span.classList.add('highlighted');
        }
      });
  }

  removeHighlight() {
    this.elementRef.nativeElement
      .querySelectorAll('.highlighted')
      .forEach((span: HTMLSpanElement) => {
        span.classList.remove('highlighted');
      });
  }

  getStartTextSelection(event: MouseEvent) {
    if (event.button !== 0) return;

    const span = event.target as HTMLSpanElement;
    const index = parseInt(span.slot);
    this.selectedTextIndex[0] = index;
  }

  getEndTextSelection(event: MouseEvent) {
    if (event.button !== 0) return;
    event.stopPropagation();
    const span = event.target as HTMLSpanElement;
    document.querySelector('.selected')?.classList.remove('selected');
    span.classList.add('selected');
    const index = parseInt(span.slot);
    this.selectedTextIndex[1] = index;

    this.addHighlight();
  }

  getStartRowSelection(event: MouseEvent) {
    if (event.button !== 0) return;
    const row = event.target as HTMLDivElement;
    const index = parseInt(row.slot);
    this.selectedTextIndex[0] = index;
  }

  getEndRowSelection(event: MouseEvent) {
    if (event.button !== 0) return;
    const row = event.target as HTMLDivElement;
    const span = document.querySelector(
      `span[slot="${row.slot}"]:last-child`
    ) as HTMLSpanElement;
    document.querySelector('.selected')?.classList.remove('selected');
    span.classList.add('selected');
    const index = parseInt(span.slot);
    this.selectedTextIndex[1] = index;
  }

  @HostListener('document:mousedown', ['$event']) onClick(
    event: KeyboardEvent
  ) {
    console.log(event);
    this.removeHighlight();
  }

  @HostListener('document:keydown', ['$event']) onKeydown(
    event: KeyboardEvent
  ) {
    this.removeHighlight();
    if (
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight'
    ) {
      setTimeout(() => {
        const selectionEnd = (this.editor.nativeElement as HTMLTextAreaElement)
          .selectionEnd;

        this.selectedTextIndex[0] = selectionEnd;
        this.selectedTextIndex[1] = selectionEnd;

        document.querySelector('.selected')?.classList.remove('selected');
        const span = document.querySelector(
          `span[slot="${this.selectedTextIndex[0]}"]`
        );
        span?.classList.add('selected');
      });
    }
  }
}

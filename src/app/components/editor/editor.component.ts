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
  text: string = '';
  selectedTextIndex: number[] = [-1, -1];
  TAB_SIZE = 4;
  END_OF_LINE_CHAR = '\n';

  ngAfterViewInit(): void {}

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

    if (visibleEditor.childElementCount === 0) {
      this.writeText({ target: hiddenEditor });
    }
  }

  writeText(event: InputEvent | any) {
    const hiddenEditor = event.target as HTMLTextAreaElement;
    const visibleEditor = this.elementRef.nativeElement.querySelector(
      'div.visible-text'
    ) as HTMLDivElement;
    const angularId = visibleEditor.attributes[0];
    console.log(visibleEditor.textContent);
    //remove
    if (
      visibleEditor.textContent !== '' &&
      event.inputType === 'deleteContentBackward'
    ) {
      if (this.selectedTextIndex[0] !== this.selectedTextIndex[1])
        this.deleteLetters(visibleEditor);
      else this.deleteOneLetter(visibleEditor);
    }
    //new row
    let row;
    if (
      visibleEditor.childElementCount === 0 ||
      event.inputType === 'insertLineBreak' ||
      hiddenEditor.value[this.selectedTextIndex[1]] === '\n'
    ) {
      console.log(hiddenEditor.value);
      console.log(event.inputType);
      row = this.createEditorRow(visibleEditor, angularId);
      row.appendChild(
        this.createEditorLetter(angularId, this.END_OF_LINE_CHAR, '0', true)
      );
      this.selectedTextIndex[1]++;
      this.selectedTextIndex[0] = this.selectedTextIndex[1];
    }
    //write
    if (!event.data) return;

    const cursorPosition =
      visibleEditor.querySelectorAll('span')[this.selectedTextIndex[1]];
    for (let i = 0; i < event.data.length; i++) {
      const newLetter = this.createEditorLetter(
        angularId,
        event.data[i],
        this.selectedTextIndex[1].toString()
      );
      cursorPosition.insertAdjacentElement('beforebegin', newLetter);
      this.selectedTextIndex[1]++;
      this.selectedTextIndex[0] = this.selectedTextIndex[1];
      console.log('-> ' + this.selectedTextIndex);
    }
  }

  private deleteLetters(visibleEditor: HTMLDivElement) {
    const selectedLetters = visibleEditor.querySelectorAll('span');
    let minIndex, maxIndex, letter;
    this.selectedTextIndex[0] < this.selectedTextIndex[1]
      ? ([minIndex, maxIndex] = [
          this.selectedTextIndex[0],
          this.selectedTextIndex[1],
        ])
      : ([minIndex, maxIndex] = [
          this.selectedTextIndex[1],
          this.selectedTextIndex[0],
        ]);

    for (let i = maxIndex; i >= minIndex; i--) {
      let lineEndIndex = i;
      while (
        selectedLetters[lineEndIndex].textContent === this.END_OF_LINE_CHAR
      ) {
        if (!selectedLetters[lineEndIndex].previousSibling) {
          break;
        }
        lineEndIndex = lineEndIndex - 1;
      }
      letter = selectedLetters[lineEndIndex];
      if (
        letter.parentElement &&
        letter.parentElement.childElementCount === 2
      ) {
        letter.parentElement.remove();
      } else {
        letter.remove();
      }
    }
    this.selectedTextIndex[1] = minIndex;
    this.selectedTextIndex[0] = this.selectedTextIndex[1];
    visibleEditor
      .querySelectorAll('span')
      [this.selectedTextIndex[1]].classList.add('selected');
  }

  private deleteOneLetter(visibleEditor: HTMLDivElement) {
    let selectedLetter =
      visibleEditor.querySelectorAll('span')[this.selectedTextIndex[1] - 1];
    if (selectedLetter.textContent === this.END_OF_LINE_CHAR) {
      selectedLetter = selectedLetter.parentElement
        ?.nextSibling as HTMLDivElement;
    }

    selectedLetter.remove();

    this.selectedTextIndex[1]--;
    this.selectedTextIndex[0] = this.selectedTextIndex[1];
    visibleEditor
      .querySelectorAll('span')
      [this.selectedTextIndex[1]].classList.add('selected');
  }

  createEditorLetter(
    angularId: Attr,
    letter: string,
    slot: string,
    selected: boolean = false
  ) {
    const span = document.createElement('span');
    span.setAttribute(angularId.name, angularId.value);
    if (selected) {
      document.querySelector('.selected')?.classList.remove('selected');
      span.classList.add('selected');
    }
    span.textContent = letter;
    span.slot = slot;
    span.addEventListener('mousedown', this.getStartTextSelection.bind(this));
    span.addEventListener('mouseup', this.getEndTextSelection.bind(this));
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
      .forEach((span: HTMLSpanElement, index: number) => {
        if (span.textContent === this.END_OF_LINE_CHAR) return;
        if (
          (index >= this.selectedTextIndex[0] &&
            index <= this.selectedTextIndex[1]) ||
          (index >= this.selectedTextIndex[1] &&
            index <= this.selectedTextIndex[0])
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
    this.removeHighlight();
  }

  @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
    console.log(event.key);
    if (
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'End' ||
      event.key === 'Home' ||
      event.key === 'PageDown' ||
      event.key === 'PageUp'
    ) {
      setTimeout(() => {
        const selectionEnd = (this.editor.nativeElement as HTMLTextAreaElement)
          .selectionEnd;
        this.selectedTextIndex[1] = selectionEnd;

        document.querySelector('.selected')?.classList.remove('selected');
        const span =
          document.querySelectorAll(`span`)[this.selectedTextIndex[1]];
        span?.classList.add('selected');
        this.addHighlight();
        if (!event.shiftKey) {
          this.selectedTextIndex[0] = selectionEnd;
          this.removeHighlight();
        }
      });
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      event.stopPropagation();
      const hiddenEditor = this.elementRef.nativeElement.querySelector(
        'textarea.hidden-text'
      ) as HTMLTextAreaElement;
      const text = hiddenEditor.value.substring(0, this.selectedTextIndex[0]);
      const text2 = hiddenEditor.value.substring(this.selectedTextIndex[0]);
      hiddenEditor.value = text + ' '.repeat(this.TAB_SIZE) + text2;
      console.log(this.selectedTextIndex);
      this.writeText({
        target: hiddenEditor,
        inputType: 'insertText',
        data: ' '.repeat(this.TAB_SIZE),
      });
      hiddenEditor.setSelectionRange(
        this.selectedTextIndex[0],
        this.selectedTextIndex[0]
      );
    }
    this.removeHighlight();
  }
}

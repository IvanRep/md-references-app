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
import { CursorPosition } from '@/app/types/CursorPosition';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
})
export class EditorComponent implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}

  @ViewChild('visibleEditor') visibleEditor!: ElementRef;
  @ViewChild('editor') editor!: ElementRef;
  text: string = '';
  cursorPosition: CursorPosition = {
    startPosition: [-1, -1],
    endPosition: [-1, -1],
  }; //[row, column];
  isFocused = false;
  TAB_SIZE = 4;
  END_OF_LINE_CHAR = '\n';

  ngAfterViewInit(): void {}

  focusEditor() {
    const visibleEditor = this.elementRef.nativeElement.querySelector(
      'div.visible-text'
    ) as HTMLDivElement;
    this.isFocused = true;
    if (visibleEditor.childElementCount === 0) {
      this.writeText({});
    }
  }

  writeText(event: KeyboardEvent | any) {
    const visibleEditor = this.elementRef.nativeElement.querySelector(
      'div.visible-text'
    ) as HTMLDivElement;
    const angularId = visibleEditor.attributes[0];
    //remove
    if (event.key === 'Backspace') {
      if (visibleEditor.textContent === this.END_OF_LINE_CHAR) return;
      if (
        this.cursorPosition.startPosition[0] !==
          this.cursorPosition.endPosition[0] &&
        this.cursorPosition.startPosition[1] !==
          this.cursorPosition.endPosition[1]
      )
        this.deleteLetters(visibleEditor);
      else this.deleteOneLetter(visibleEditor);
      return;
    }
    //new row
    let row;
    if (visibleEditor.childElementCount === 0 || event.key === 'Enter') {
      this.cursorPosition.endPosition[0]++;
      this.cursorPosition.endPosition[1] = 0;
      this.cursorPosition.startPosition =
        this.cursorPosition.endPosition.slice();

      row = this.createEditorRow(
        visibleEditor,
        angularId,
        this.cursorPosition.endPosition[0]
      );
      row.appendChild(
        this.createEditorLetter(angularId, this.END_OF_LINE_CHAR, -1, true)
      );
      return;
    }
    //write
    const data = event.data ? event.data : event.key;
    // this.text =
    //   this.text.substring(0, this.cursorPosition[0]) +
    //   data +
    //   this.text.substring(this.cursorPosition[1]);
    const cursorPositionSpan = visibleEditor
      .querySelectorAll('.row')
      [this.cursorPosition.endPosition[0]].querySelectorAll('span')[
      this.cursorPosition.endPosition[1]
    ];

    for (let i = 0; i < data.length; i++) {
      const newLetter = this.createEditorLetter(
        angularId,
        data[i],
        this.cursorPosition.endPosition[1]
      );
      cursorPositionSpan.insertAdjacentElement('beforebegin', newLetter);
      this.cursorPosition.endPosition[1]++;
      this.cursorPosition.startPosition =
        this.cursorPosition.endPosition.slice();
      console.log('-> ' + this.cursorPosition);
      this.text = visibleEditor.textContent ?? '';
      console.log(this.text);
    }
  }

  deleteLetters(visibleEditor: HTMLDivElement) {
    // const selectedLetters = visibleEditor.querySelectorAll('.row');
    // let minIndex, maxIndex, letter;
    // // this.cursorPosition[0] < this.cursorPosition[1]
    // //   ? ([minIndex, maxIndex] = [
    // //       this.cursorPosition[0],
    // //       this.cursorPosition[1],
    // //     ])
    // //   : ([minIndex, maxIndex] = [
    // //       this.cursorPosition[1],
    // //       this.cursorPosition[0],
    // //     ]);
    // for (let i = maxIndex; i >= minIndex; i--) {
    //   let lineEndIndex = i;
    //   while (
    //     selectedLetters[lineEndIndex].textContent === this.END_OF_LINE_CHAR
    //   ) {
    //     if (!selectedLetters[lineEndIndex].previousSibling) {
    //       break;
    //     }
    //     lineEndIndex = lineEndIndex - 1;
    //   }
    //   letter = selectedLetters[lineEndIndex];
    //   if (
    //     letter.parentElement &&
    //     letter.parentElement.childElementCount === 2
    //   ) {
    //     letter.parentElement.remove();
    //   } else {
    //     letter.remove();
    //   }
    // }
    // this.cursorPosition[1] = minIndex;
    // this.cursorPosition[0] = this.cursorPosition[1];
    // visibleEditor
    //   .querySelectorAll('span')
    //   [this.cursorPosition[1]].classList.add('selected');

    //test
    let minRowIndex, maxRowIndex;
    this.cursorPosition.startPosition[0] < this.cursorPosition.endPosition[0]
      ? ([minRowIndex, maxRowIndex] = [
          this.cursorPosition.startPosition,
          this.cursorPosition.endPosition,
        ])
      : ([minRowIndex, maxRowIndex] = [
          this.cursorPosition.endPosition,
          this.cursorPosition.startPosition,
        ]);
    visibleEditor
      .querySelectorAll('.row')
      .forEach((row: Element, rowIndex: number) => {
        if (rowIndex > minRowIndex[0] && rowIndex < maxRowIndex[0]) {
          row.remove();
          return;
        }

        if (minRowIndex[0] === maxRowIndex[0] && rowIndex === minRowIndex[0]) {
          row.childNodes.forEach((span: ChildNode, spanIndex: number) => {
            if (span.textContent === this.END_OF_LINE_CHAR) return;
            if (
              (spanIndex >= minRowIndex[1] && spanIndex <= maxRowIndex[1]) ||
              (spanIndex <= minRowIndex[1] && spanIndex >= maxRowIndex[1])
            ) {
              (span as HTMLSpanElement).remove();
            }
          });
          return;
        }
        if (rowIndex === minRowIndex[0]) {
          row.childNodes.forEach((span: ChildNode, spanIndex: number) => {
            if (span.textContent === this.END_OF_LINE_CHAR) return;
            if (spanIndex >= minRowIndex[1]) {
              (span as HTMLSpanElement).remove();
            }
          });
          return;
        }
        if (rowIndex === maxRowIndex[0]) {
          row.childNodes.forEach((span: ChildNode, spanIndex: number) => {
            if (span.textContent === this.END_OF_LINE_CHAR) return;
            if (spanIndex <= minRowIndex[1]) {
              (span as HTMLSpanElement).remove();
            }
          });
          return;
        }
      });
    this.cursorPosition.endPosition[0] = minRowIndex[0];
    this.cursorPosition.endPosition[1] = minRowIndex[1];
    this.cursorPosition.startPosition = this.cursorPosition.endPosition.slice();
    visibleEditor
      .querySelectorAll('.row')
      [this.cursorPosition.endPosition[0]].querySelectorAll('span')
      [this.cursorPosition.endPosition[1]].classList.add('selected');
  }

  private deleteOneLetter(visibleEditor: HTMLDivElement) {
    let selectedLetter = visibleEditor
      .querySelectorAll('.row')
      [this.cursorPosition.endPosition[0]].querySelectorAll('span')[
      this.cursorPosition.endPosition[1] - 1
    ];
    if (selectedLetter.textContent === this.END_OF_LINE_CHAR) {
      if (!selectedLetter.parentElement) return;
      this.cursorPosition.endPosition[0]--;
      this.cursorPosition.endPosition[1] =
        selectedLetter.parentElement.childElementCount - 1;

      selectedLetter = selectedLetter.parentElement
        .nextSibling as HTMLDivElement;
    } else {
      this.cursorPosition.endPosition[1]--;
    }

    selectedLetter.remove();

    this.cursorPosition.startPosition = this.cursorPosition.endPosition.slice();
    visibleEditor
      .querySelectorAll('.row')
      [this.cursorPosition.endPosition[0]].querySelectorAll('span')
      [this.cursorPosition.endPosition[1]].classList.add('selected');
  }

  createEditorLetter(
    angularId: Attr,
    letter: string,
    position: number,
    selected: boolean = false
  ) {
    const span = document.createElement('span');
    span.setAttribute(angularId.name, angularId.value);
    span.setAttribute('position', position.toString());
    if (selected) {
      document.querySelector('.selected')?.classList.remove('selected');
      span.classList.add('selected');
    }
    span.textContent = letter;
    span.addEventListener('mousedown', this.getStartTextSelection.bind(this));
    span.addEventListener('mouseup', this.getEndTextSelection.bind(this));
    return span;
  }

  createEditorRow(editor: HTMLDivElement, angularId: Attr, position: number) {
    let row = document.createElement('div');
    row.classList.add('row');
    row.setAttribute(angularId.name, angularId.value);
    row.setAttribute('position', position.toString());
    row.addEventListener('mousedown', this.getStartRowSelection.bind(this));
    row.addEventListener('mouseup', this.getEndRowSelection.bind(this));
    editor.appendChild(row);
    return row;
  }

  addHighlight() {
    let minIndex, maxIndex;
    this.cursorPosition.startPosition[0] < this.cursorPosition.endPosition[0]
      ? ([minIndex, maxIndex] = [
          this.cursorPosition.startPosition,
          this.cursorPosition.endPosition,
        ])
      : ([minIndex, maxIndex] = [
          this.cursorPosition.endPosition,
          this.cursorPosition.startPosition,
        ]);
    this.visibleEditor.nativeElement
      .querySelectorAll('.row')
      .forEach((row: HTMLDivElement, rowIndex: number) => {
        if (rowIndex > minIndex[0] && rowIndex < maxIndex[0]) {
          row.classList.add('highlighted');
          return;
        }
        if (minIndex[0] === maxIndex[0] && rowIndex === minIndex[0]) {
          row.childNodes.forEach((span: ChildNode, spanIndex: number) => {
            if (
              (spanIndex >= minIndex[1] && spanIndex <= maxIndex[1]) ||
              (spanIndex <= minIndex[1] && spanIndex >= maxIndex[1])
            ) {
              (span as HTMLSpanElement).classList.add('highlighted');
            }
          });
          return;
        }
        if (rowIndex === minIndex[0]) {
          row.childNodes.forEach((span: ChildNode, spanIndex: number) => {
            if (spanIndex >= minIndex[1]) {
              (span as HTMLSpanElement).classList.add('highlighted');
            }
          });
        }
        if (rowIndex === maxIndex[0]) {
          row.childNodes.forEach((span: ChildNode, spanIndex: number) => {
            if (spanIndex <= minIndex[1]) {
              (span as HTMLSpanElement).classList.add('highlighted');
            }
          });
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
    this.cursorPosition.startPosition[1] = parseInt(
      span.getAttribute('position') as string
    );
    this.cursorPosition.startPosition[0] = parseInt(
      span.parentElement?.getAttribute('position') as string
    );
  }

  getEndTextSelection(event: MouseEvent) {
    if (event.button !== 0) return;
    event.stopPropagation();
    const span = event.target as HTMLSpanElement;
    document.querySelector('.selected')?.classList.remove('selected');
    span.classList.add('selected');
    this.cursorPosition.endPosition[1] = parseInt(
      span.getAttribute('position') as string
    );
    this.cursorPosition.endPosition[0] = parseInt(
      span.parentElement?.getAttribute('position') as string
    );

    this.addHighlight();
  }

  getStartRowSelection(event: MouseEvent) {
    if (event.button !== 0) return;
    const row = event.target as HTMLDivElement;
    this.cursorPosition.startPosition[0] = parseInt(
      row.getAttribute('position') as string
    );
    this.cursorPosition.startPosition[1] = parseInt(
      row.lastElementChild?.getAttribute('position') as string
    );
  }

  getEndRowSelection(event: MouseEvent) {
    if (event.button !== 0) return;
    const row = event.target as HTMLDivElement;
    const span = row.lastElementChild as HTMLSpanElement;
    document.querySelector('.selected')?.classList.remove('selected');
    span.classList.add('selected');
    this.cursorPosition.endPosition[0] = parseInt(
      row.getAttribute('position') as string
    );
    this.cursorPosition.endPosition[1] = parseInt(
      span.getAttribute('position') as string
    );
  }

  moveCursor(move: string) {
    const cursorPositionRow = this.elementRef.nativeElement.querySelector(
      '.row'
    )[this.cursorPosition.endPosition[0]] as HTMLDivElement;
    switch (move) {
      case 'ArrowLeft':
        if (this.cursorPosition.endPosition[1] <= 0) {
          if (!cursorPositionRow.previousElementSibling) return;
          this.cursorPosition.endPosition[0]--;
          this.cursorPosition.endPosition[1] =
            cursorPositionRow.previousElementSibling?.childElementCount - 1;
        } else {
          this.cursorPosition.endPosition[1]--;
        }

        this.cursorPosition.startPosition =
          this.cursorPosition.endPosition.slice();
        break;
      case 'ArrowRight':
        if (
          this.cursorPosition.endPosition[1] >=
          cursorPositionRow.childElementCount - 1
        ) {
          if (!cursorPositionRow.nextElementSibling) return;
          this.cursorPosition.endPosition[0]++;
          this.cursorPosition.endPosition[1] = 0;
        } else {
          this.cursorPosition.endPosition[1]++;
        }

        this.cursorPosition.startPosition =
          this.cursorPosition.endPosition.slice();
        break;
      case 'ArrowUp':
    }

    const cursorPositionSpan = this.visibleEditor.nativeElement
      .querySelectorAll('.row')
      [this.cursorPosition.endPosition[0]].querySelectorAll('span')[
      this.cursorPosition.endPosition[1]
    ];
    cursorPositionSpan?.classList.add('selected');
  }

  @HostListener('document:mousedown', ['$event']) onClick(
    event: KeyboardEvent
  ) {
    this.removeHighlight();
    this.isFocused = false;
  }

  @HostListener('document:keydown', ['$event']) onKeydown(
    event: KeyboardEvent
  ) {
    if (!this.isFocused) return;
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
      this.moveCursor(event.key);
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      event.stopPropagation();
      console.log(this.cursorPosition);
      this.writeText({
        data: ' '.repeat(this.TAB_SIZE),
      });
      return;
    }
    this.removeHighlight();
    this.writeText(event);
  }
}

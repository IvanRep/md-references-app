import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { CursorPosition } from '@/app/types/CursorPosition';
import MarkdownParser from '@/app/utils/MarkdownParser';

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
  TAB_SIZE: number = 4;
  END_OF_LINE_CHAR: string = '\n';
  WORD_SEPARATOR: string[] = [
    ' ',
    '\n',
    '\t',
    '.',
    ',',
    '!',
    '?',
    '_',
    '(',
    ')',
    '[',
    ']',
    '{',
    '}',
  ];
  text: string = '';
  cursorPosition: CursorPosition = {
    startPosition: [-1, -1],
    endPosition: [-1, -1],
  }; //[row, column];
  isFocused: boolean = false;
  isSelectionActive: boolean = false;
  selectedLetters: HTMLSpanElement[] = [];

  ngAfterViewInit(): void {}

  focusEditor() {
    const visibleEditor = this.elementRef.nativeElement.querySelector(
      'div.visible-text'
    ) as HTMLDivElement;
    this.isFocused = true;
    if (visibleEditor.childElementCount === 0) {
      this.writeText({});
    }
    this.showCursor();
  }

  writeText(event: KeyboardEvent | any) {
    const visibleEditor = this.visibleEditor.nativeElement as HTMLDivElement;
    const angularId = visibleEditor.attributes[0];
    //remove
    if (event.key === 'Backspace' || event.key === 'Delete') {
      if (visibleEditor.textContent === this.END_OF_LINE_CHAR) return;
      if (
        this.cursorPosition.startPosition[0] !==
          this.cursorPosition.endPosition[0] ||
        this.cursorPosition.startPosition[1] !==
          this.cursorPosition.endPosition[1]
      )
        this.deleteLetters(visibleEditor);
      else if (event.key === 'Backspace') this.deleteOneLetter(visibleEditor);
      else if (event.key === 'Delete')
        this.deleteOneLetterForward(visibleEditor);

      const selectedRow =
        visibleEditor.querySelectorAll('.row')[
          this.cursorPosition.endPosition[0]
        ];
      setTimeout(() => this.checkMarkdown(selectedRow as HTMLDivElement));
      return;
    }
    //new row
    if (visibleEditor.childElementCount === 0 || event.key === 'Enter') {
      const selectedRow =
        visibleEditor.querySelectorAll('.row')[
          this.cursorPosition.endPosition[0]
        ];
      const newRow = this.createEditorRow(
        angularId,
        this.cursorPosition.endPosition[0] + 1
      );
      newRow.appendChild(
        this.createEditorLetter(angularId, this.END_OF_LINE_CHAR, -1)
      );
      if (selectedRow) {
        selectedRow.insertAdjacentElement('afterend', newRow);
        const i = this.cursorPosition.endPosition[1];
        while (i < selectedRow.childElementCount - 1) {
          const childText = selectedRow.childNodes[i].textContent ?? '';
          const newLetter = this.createEditorLetter(
            angularId,
            childText,
            newRow.childElementCount - 1
          );
          (newRow.lastChild as HTMLSpanElement).insertAdjacentElement(
            'beforebegin',
            newLetter
          );
          selectedRow.childNodes[i].remove();
        }
      } else visibleEditor.appendChild(newRow);

      this.cursorPosition.endPosition[0]++;
      this.cursorPosition.endPosition[1] = 0;
      this.cursorPosition.startPosition =
        this.cursorPosition.endPosition.slice();
      visibleEditor.querySelector('.selected')?.classList.remove('selected');
      const newFocus = visibleEditor
        .querySelectorAll('.row')
        [this.cursorPosition.endPosition[0]].querySelectorAll('span')[
        this.cursorPosition.endPosition[1]
      ];
      newFocus.focus();
      newFocus.classList.add('selected');

      setTimeout(() => this.checkMarkdown(selectedRow as HTMLDivElement));
      setTimeout(() => this.checkMarkdown(newRow as HTMLDivElement));
      return;
    }
    //write
    const data = event.data ? event.data : event.key;
    const cursorPositionSpan = visibleEditor
      .querySelectorAll('.row')
      [this.cursorPosition.endPosition[0]].querySelectorAll('span')[
      this.cursorPosition.endPosition[1]
    ];
    cursorPositionSpan.focus();

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
      this.text = visibleEditor.textContent ?? '';
    }

    setTimeout(() =>
      this.checkMarkdown(cursorPositionSpan.parentElement as HTMLDivElement)
    );
  }

  deleteLetters(visibleEditor: HTMLDivElement) {
    let minRowIndex, maxRowIndex;

    this.cursorPosition.endPosition = this.getMinCursorPosition();

    for (let i = this.selectedLetters.length - 1; i >= 0; i--) {
      this.selectedLetters.pop();
      this.deleteOneLetterForward(visibleEditor);
    }

    this.cursorPosition.startPosition = this.cursorPosition.endPosition.slice();
  }

  private deleteOneLetter(visibleEditor: HTMLDivElement) {
    const angularId = visibleEditor.attributes[0];
    const letterPosition =
      this.cursorPosition.endPosition[1] <= 0
        ? 0
        : this.cursorPosition.endPosition[1] - 1;
    let selectedLetter = visibleEditor
      .querySelectorAll('.row')
      [this.cursorPosition.endPosition[0]].querySelectorAll('span')[
      letterPosition
    ];
    if (this.cursorPosition.endPosition[1] <= 0) {
      if (
        !selectedLetter.parentElement ||
        !selectedLetter.parentElement.previousElementSibling
      )
        return;

      this.cursorPosition.endPosition[0]--;
      this.cursorPosition.endPosition[1] =
        selectedLetter.parentElement.previousElementSibling.childElementCount -
        1;

      selectedLetter.parentElement.previousElementSibling?.lastChild?.remove();
      selectedLetter.parentElement.childNodes.forEach((child: ChildNode) => {
        const span = child as HTMLSpanElement;
        const position = parseInt(span.getAttribute('position') ?? '-1');
        const newLetter = this.createEditorLetter(
          angularId,
          span.textContent ?? '',
          position
        );
        selectedLetter.parentElement?.previousElementSibling?.appendChild(
          newLetter
        );
      });

      selectedLetter = selectedLetter.parentElement as HTMLDivElement;
    } else {
      this.cursorPosition.endPosition[1]--;
    }

    selectedLetter.remove();

    this.cursorPosition.startPosition = this.cursorPosition.endPosition.slice();
    this.showCursor();
  }

  private deleteOneLetterForward(visibleEditor: HTMLDivElement) {
    const angularId = visibleEditor.attributes[0];
    let selectedRow =
      visibleEditor.querySelectorAll('.row')[
        this.cursorPosition.endPosition[0]
      ];
    let selectedLetter =
      selectedRow.querySelectorAll('span')[this.cursorPosition.endPosition[1]];
    if (selectedLetter.textContent === this.END_OF_LINE_CHAR) {
      const nextRow = selectedRow.nextElementSibling;
      if (!selectedLetter.parentElement || !nextRow) return;

      selectedLetter.remove();
      nextRow.childNodes.forEach((child: ChildNode) => {
        const span = child as HTMLSpanElement;
        const position = parseInt(span.getAttribute('position') ?? '-1');
        const newLetter = this.createEditorLetter(
          angularId,
          span.textContent ?? '',
          position
        );
        selectedRow.appendChild(newLetter);
      });

      selectedLetter = nextRow as HTMLDivElement;
    }

    selectedLetter.remove();

    this.showCursor();
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
    span.setAttribute('data-text', letter);
    span.textContent = letter;

    if (selected) {
      this.removeCursor();
      span.classList.add('selected');
    }
    span.addEventListener('mousedown', this.getStartTextSelection.bind(this));
    span.addEventListener('mouseup', this.getEndTextSelection.bind(this));
    span.addEventListener('mouseover', this.overSelection.bind(this));
    return span;
  }

  createEditorRow(angularId: Attr, position: number) {
    let row = document.createElement('div');
    row.classList.add('row');
    row.setAttribute(angularId.name, angularId.value);
    row.setAttribute('position', position.toString());
    row.addEventListener('mousedown', this.getStartRowSelection.bind(this));
    row.addEventListener('mouseup', this.getEndRowSelection.bind(this));
    return row;
  }

  addHighlight() {
    console.log(this.cursorPosition);
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
    this.removeHighlight();
    if (event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();
    this.selectedLetters = [];
    this.isSelectionActive = true;

    const span = event.target as HTMLSpanElement;
    span.classList.add('highlighted');
    this.selectedLetters.push(span);

    const rowPosition = [
      ...this.elementRef.nativeElement.querySelectorAll('.row'),
    ].indexOf(span.parentElement as HTMLDivElement);
    const colPosition = [
      ...span.parentElement!.querySelectorAll('span'),
    ].indexOf(span);

    this.cursorPosition.startPosition[0] = rowPosition;
    this.cursorPosition.startPosition[1] = colPosition;
  }

  overSelection(event: MouseEvent) {
    if (!this.isSelectionActive) return;
    const span = event.currentTarget as HTMLSpanElement;
    if (span.classList.contains('highlighted')) {
      this.selectedLetters = this.selectedLetters.filter(
        (letter: HTMLSpanElement, index: number) => {
          if (index > this.selectedLetters.indexOf(span)) {
            letter.classList.remove('highlighted');
            return;
          } else return letter;
        }
      );
    } else {
      const editorSpans =
        this.elementRef.nativeElement.querySelectorAll('span');
      const spanPosition = [...editorSpans].indexOf(span);
      const previousSpanPosition = [...editorSpans].indexOf(
        this.selectedLetters[this.selectedLetters.length - 1]
      );
      console.log(previousSpanPosition, spanPosition);
      if (
        previousSpanPosition !== -1 &&
        previousSpanPosition < spanPosition &&
        previousSpanPosition + 1 !== spanPosition
      ) {
        for (let i = previousSpanPosition + 1; i < spanPosition; i++) {
          editorSpans[i].classList.add('highlighted');
          this.selectedLetters.push(editorSpans[i] as HTMLSpanElement);
        }
      }
      if (
        previousSpanPosition !== -1 &&
        previousSpanPosition > spanPosition &&
        previousSpanPosition - 1 !== spanPosition
      ) {
        for (let i = previousSpanPosition - 1; i > spanPosition; i--) {
          editorSpans[i].classList.add('highlighted');
          this.selectedLetters.push(editorSpans[i] as HTMLSpanElement);
        }
      }
      span.classList.add('highlighted');
      this.selectedLetters.push(span);
    }
  }

  getEndTextSelection(event: MouseEvent) {
    if (event.button !== 0) return;

    event.stopPropagation();
    event.preventDefault();
    this.isSelectionActive = false;

    const span = event.target as HTMLSpanElement;
    this.removeCursor();
    span.classList.add('selected');
    const colPosition = [
      ...span.parentElement!.querySelectorAll('span'),
    ].indexOf(span);
    const rowPosition = [
      ...this.elementRef.nativeElement.querySelectorAll('.row'),
    ].indexOf(span.parentElement as HTMLDivElement);

    this.cursorPosition.endPosition[0] = rowPosition;
    this.cursorPosition.endPosition[1] = colPosition;

    if (span.isSameNode(this.selectedLetters[0])) {
      this.removeHighlight();
      return;
    }
  }

  //Doesn't work
  getStartRowSelection(event: MouseEvent) {
    if (event.button !== 0) return;
    this.selectedLetters = [];
    this.isSelectionActive = true;

    const row = event.target as HTMLDivElement;
    const span = row.lastElementChild as HTMLSpanElement;
    const newEvent = new MouseEvent('mousedown', { button: 0 });
    span.dispatchEvent(newEvent);
  }

  getEndRowSelection(event: MouseEvent) {
    if (event.button !== 0) return;
    this.isSelectionActive = false;

    const row = event.target as HTMLDivElement;
    const rowPosition = [
      ...this.elementRef.nativeElement.querySelectorAll('.row'),
    ].indexOf(row as HTMLDivElement);
    const span = row.lastElementChild as HTMLSpanElement;
    this.removeCursor();
    span.classList.add('selected');
    this.cursorPosition.endPosition[0] = rowPosition;
    this.cursorPosition.endPosition[1] = row.childElementCount - 1;

    if (span.isSameNode(this.selectedLetters[0])) {
      this.removeHighlight();
      return;
    }
  }

  moveCursor(move: KeyboardEvent) {
    const cursorPositionRow = this.elementRef.nativeElement.querySelectorAll(
      '.row'
    )[this.cursorPosition.endPosition[0]] as HTMLDivElement;
    let cursorPositionLetter =
      cursorPositionRow.querySelectorAll('span')[
        this.cursorPosition.endPosition[1]
      ];
    //Move
    switch (move.key) {
      case 'ArrowLeft':
        if (this.cursorPosition.endPosition[1] <= 0) {
          if (!cursorPositionRow.previousElementSibling) return;
          this.cursorPosition.endPosition[0]--;
          this.cursorPosition.endPosition[1] =
            cursorPositionRow.previousElementSibling?.childElementCount - 1;
        } else {
          this.cursorPosition.endPosition[1]--;
        }

        // Move cursor to next word
        if (move.ctrlKey) {
          const cursorPositionAfterMove = this.visibleEditor.nativeElement
            .querySelectorAll('.row')
            [this.cursorPosition.endPosition[0]].querySelectorAll('span')[
            this.cursorPosition.endPosition[1] - 1
          ];
          if (
            !cursorPositionAfterMove ||
            this.WORD_SEPARATOR.includes(cursorPositionAfterMove.textContent)
          )
            return;
          this.moveCursor(move);
        }
        //Shift + Arrow -> Active Selection key (Left Version [after move])
        if (move.shiftKey) {
          cursorPositionLetter = this.visibleEditor.nativeElement
            .querySelectorAll('.row')
            [this.cursorPosition.endPosition[0]].querySelectorAll('span')[
            this.cursorPosition.endPosition[1]
          ];
          const mouseEvent = new MouseEvent('mouseover');
          this.isSelectionActive = true;
          cursorPositionLetter?.dispatchEvent(mouseEvent);
          this.isSelectionActive = false;
        }
        break;
      case 'ArrowRight':
        //Shift + Arrow -> Active Selection key (Right Version [pre move])
        if (move.shiftKey) {
          const mouseEvent = new MouseEvent('mouseover');
          this.isSelectionActive = true;
          cursorPositionLetter?.dispatchEvent(mouseEvent);
          this.isSelectionActive = false;
        }

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

        // Move cursor to next word
        if (move.ctrlKey) {
          const cursorPositionAfterMove = this.visibleEditor.nativeElement
            .querySelectorAll('.row')
            [this.cursorPosition.endPosition[0]].querySelectorAll('span')[
            this.cursorPosition.endPosition[1]
          ];
          if (
            !cursorPositionAfterMove ||
            this.WORD_SEPARATOR.includes(cursorPositionAfterMove.textContent)
          )
            return;
          this.moveCursor(move);
        }
        break;
      case 'ArrowUp':
        //Shift + Arrow -> Active Selection key (Up Version [before move])
        if (move.shiftKey) {
          !cursorPositionLetter.previousElementSibling
            ? (cursorPositionLetter = cursorPositionRow?.previousElementSibling
                ?.lastElementChild as HTMLSpanElement)
            : (cursorPositionLetter =
                cursorPositionLetter.previousElementSibling as HTMLSpanElement);
          const mouseEvent = new MouseEvent('mouseover');
          this.isSelectionActive = true;
          cursorPositionLetter.previousElementSibling?.dispatchEvent(
            mouseEvent
          );
          this.isSelectionActive = false;
        }

        if (!cursorPositionRow.previousElementSibling) {
          this.cursorPosition.endPosition[1] = 0;
        } else {
          const previousRowLastLetterNumber =
            cursorPositionRow.previousElementSibling?.childElementCount - 1;

          this.cursorPosition.endPosition[0]--;
          this.cursorPosition.endPosition[1] =
            previousRowLastLetterNumber >= this.cursorPosition.endPosition[1]
              ? this.cursorPosition.endPosition[1]
              : previousRowLastLetterNumber;
        }

        //Shift + Arrow -> Active Selection key (Up Version [after move])
        if (move.shiftKey) {
          cursorPositionLetter = this.visibleEditor.nativeElement
            .querySelectorAll('.row')
            [this.cursorPosition.endPosition[0]].querySelectorAll('span')[
            this.cursorPosition.endPosition[1]
          ];
          const mouseEvent = new MouseEvent('mouseover');
          this.isSelectionActive = true;
          cursorPositionLetter?.dispatchEvent(mouseEvent);
          this.isSelectionActive = false;
        }

        break;
      case 'ArrowDown':
        //Shift + Arrow -> Active Selection key (Down Version [before move])
        if (move.shiftKey) {
          const mouseEvent = new MouseEvent('mouseover');
          this.isSelectionActive = true;
          cursorPositionLetter?.dispatchEvent(mouseEvent);
          this.isSelectionActive = false;
        }

        if (!cursorPositionRow.nextElementSibling) {
          this.cursorPosition.endPosition[1] =
            cursorPositionRow.childElementCount - 1;
        } else {
          const nextRowLettersCount =
            cursorPositionRow.nextElementSibling?.childElementCount - 1;

          this.cursorPosition.endPosition[0]++;
          this.cursorPosition.endPosition[1] =
            nextRowLettersCount >= this.cursorPosition.endPosition[1]
              ? this.cursorPosition.endPosition[1]
              : nextRowLettersCount;
        }

        //Shift + Arrow -> Active Selection key (Down Version [after move])
        if (move.shiftKey) {
          cursorPositionLetter = this.visibleEditor.nativeElement
            .querySelectorAll('.row')
            [this.cursorPosition.endPosition[0]].querySelectorAll('span')[
            this.cursorPosition.endPosition[1]
          ];
          !cursorPositionLetter.previousElementSibling
            ? (cursorPositionLetter = cursorPositionLetter.parentElement
                ?.previousElementSibling?.lastElementChild as HTMLSpanElement)
            : (cursorPositionLetter =
                cursorPositionLetter.previousElementSibling as HTMLSpanElement);
          const mouseEvent = new MouseEvent('mouseover');
          this.isSelectionActive = true;
          cursorPositionLetter?.dispatchEvent(mouseEvent);
          this.isSelectionActive = false;
        }
        break;
      case 'End':
      case 'PageDown':
        const lastRow = (this.visibleEditor.nativeElement as HTMLDivElement)
          .lastElementChild;
        const lastLetterNumber = lastRow!.childElementCount - 1;
        console.log(lastLetterNumber);
        this.cursorPosition.endPosition[0] =
          this.visibleEditor.nativeElement.childElementCount - 1;
        this.cursorPosition.endPosition[1] = lastLetterNumber;

        break;
      case 'Home':
      case 'PageUp':
        const firstRowNumber = 0;
        const firstLetterNumber = 0;
        this.cursorPosition.endPosition[0] = firstRowNumber;
        this.cursorPosition.endPosition[1] = firstLetterNumber;

        break;
    }

    //Selection key
    if (!move.shiftKey)
      this.cursorPosition.startPosition =
        this.cursorPosition.endPosition.slice();

    //Show cursor
    this.showCursor();
  }

  showCursor() {
    const cursorPositionSpan = this.visibleEditor.nativeElement
      .querySelectorAll('.row')
      [this.cursorPosition.endPosition[0]].querySelectorAll('span')[
      this.cursorPosition.endPosition[1]
    ];
    this.visibleEditor.nativeElement
      .querySelector('.selected')
      ?.classList.remove('selected');

    cursorPositionSpan?.classList.add('selected');
  }

  removeCursor() {
    document.querySelector('.selected')?.classList.remove('selected');
  }

  getMinCursorPosition() {
    if (
      this.cursorPosition.startPosition[0] ===
      this.cursorPosition.endPosition[0]
    ) {
      return this.cursorPosition.startPosition[1] <
        this.cursorPosition.endPosition[1]
        ? this.cursorPosition.startPosition.slice()
        : this.cursorPosition.endPosition.slice();
    } else if (
      this.cursorPosition.startPosition[0] < this.cursorPosition.endPosition[0]
    ) {
      return this.cursorPosition.startPosition.slice();
    } else {
      return this.cursorPosition.endPosition.slice();
    }
  }

  checkMarkdown(container: HTMLDivElement) {
    if (!container || !container.textContent) return;
    this.removeMarkdown(container);
    const text = container.textContent.split(this.END_OF_LINE_CHAR)[0];
    const matches = MarkdownParser.matchMarkdownRegex(text);
    for (let match of matches) {
      const { type, index, length, content } = match;
      for (let i = index; i <= length; i++) {
        container.children[i].classList.add(type);
      }
    }
  }

  removeMarkdown(container: HTMLDivElement) {
    if (!container) return;
    for (let child of container.children) {
      const markdownClasses = Object.keys(MarkdownParser.MARKDOWN_REGEX);

      child.classList.remove(...markdownClasses);
    }
  }

  paste() {
    navigator.clipboard.readText().then((text) => {
      this.writeText({ data: text });
    });
  }

  copy() {
    const minCursorPosition = this.getMinCursorPosition();
    if (
      minCursorPosition[0] === this.cursorPosition.endPosition[0] &&
      minCursorPosition[1] === this.cursorPosition.endPosition[1]
    )
      this.selectedLetters.reverse();

    let selectedText = '';
    this.selectedLetters.forEach((span) => {
      selectedText += span.textContent;
    });
    navigator.clipboard.writeText(selectedText);
  }

  @HostListener('document:mousedown', ['$event']) onClick(
    event: KeyboardEvent
  ) {
    this.removeHighlight();
    this.isSelectionActive = false;
    this.isFocused = false;
    this.removeCursor();
  }

  @HostListener('document:keydown', ['$event']) onKeydown(
    event: KeyboardEvent
  ) {
    if (!this.isFocused) {
      this.removeHighlight();
      return;
    }
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
      if (!event.shiftKey) {
        this.selectedLetters = [];
        this.removeHighlight();
      }
      this.moveCursor(event);
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      event.stopPropagation();
      this.removeHighlight();
      this.writeText({
        data: ' '.repeat(this.TAB_SIZE),
      });
      return;
    }
    if (event.ctrlKey && event.key === 'v') {
      this.removeHighlight();
      this.paste();
      return;
    }
    if (event.ctrlKey && event.key === 'c') {
      this.copy();
      return;
    }
    if (event.ctrlKey && event.key === 'a') {
      const lastRow = this.visibleEditor.nativeElement.children[
        this.visibleEditor.nativeElement.children.length - 1
      ] as HTMLDivElement;
      const firstLetter = this.visibleEditor.nativeElement.querySelector(
        'span'
      ) as HTMLSpanElement;
      const lastLetter = lastRow.lastElementChild as HTMLSpanElement;
      this.cursorPosition.startPosition = [0, 0];
      this.cursorPosition.endPosition = [
        this.visibleEditor.nativeElement.children.length - 1,
        lastRow.children.length - 1,
      ];
      this.selectedLetters = [];
      firstLetter.dispatchEvent(new MouseEvent('mousedown', { button: 0 }));
      lastLetter.dispatchEvent(new MouseEvent('mouseover'));
      return;
    }
    if (
      event.key.match(/^\S$/i) ||
      event.key === ' ' ||
      event.key === 'Enter' ||
      event.key === 'Backspace' ||
      event.key === 'Delete'
    ) {
      this.removeHighlight();
      this.writeText(event);
    }
  }
}

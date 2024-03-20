import { Injectable } from '@angular/core';
import { Reference } from '@/app/types/Reference';
import { BehaviorSubject, Observable } from 'rxjs';

const referenceList: Reference[] = [];

@Injectable({
  providedIn: 'root',
})
export class MarkdownService {
  private subject = new BehaviorSubject<Reference[]>(referenceList);
  referenceList$: Observable<Reference[]> = this.subject.asObservable();

  constructor() {}

  setMarkdown(file: File): void {
    file.text().then((text) => {
      this.parse(text);
    });
  }

  parse(text: string): void {
    const lines = text.split(/\r\n/);
    let category: string = '';
    let isTable = false;
    let tableHead: string[] = [];
    let reference: any = {};
    let referenceList: Reference[] = [];
    for (const line of lines) {
      if (line.startsWith('#')) {
        isTable = false;
        category = line.replaceAll('#', '').trim();
      }
      if (line.startsWith('|')) {
        if ((isTable && line.includes('name')) || line.startsWith('| -'))
          continue;
        line.split('|').forEach((cell, index) => {
          if (cell === '') return;
          if (isTable) {
            reference = {
              ...reference,
              [tableHead[index - 1]]: cell.trim(), //index - 1 because first and last column are empty
            };
          } else {
            tableHead.push(cell.trim());
          }
        });
        if (isTable) {
          reference = { ...reference, category };
          console.log('type', typeof (reference as Reference));
          if (reference.hasOwnProperty('name', 'category'))
            referenceList.push(reference);
          reference = {};
        }
        isTable = true;
      }
    }
    this.subject.next(referenceList);
  }
}

import { Injectable, NgZone } from '@angular/core';
import { Reference } from '@/app/types/Reference';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { TypedError } from '../error/TypedError';
import { HttpClient } from '@angular/common/http';
const referenceList: Reference[] = [];

@Injectable({
  providedIn: 'platform',
})
export class MarkdownService {
  API_URL = '';

  referenceSubject = new Subject<Reference[]>();
  referenceList: Reference[] = [];

  markdownFileSubject = new Subject<File>();
  markdownFile: File | undefined = undefined;

  constructor(private http: HttpClient) {
    this.markdownFileSubject.subscribe({
      next: (file: File) => {
        this.markdownFile = file;
      },
    });

    this.referenceSubject.subscribe({
      next: (referenceList: Reference[]) => {
        this.referenceList = referenceList;
      },
    });
  }

  setMarkdown(file: File): void {
    this.markdownFileSubject.next(file);
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
    this.referenceSubject.next(referenceList);
  }

  save() {
    if (!this.markdownFile) return;

    this.markdownFile.text().then((text) => {
      const body = {
        text: text,
        user: {
          id: 0,
          user: '',
          password: '',
        },
      };
      console.log(body);
      // this.http.post(this.API_URL, body).subscribe();
    });
  }
}

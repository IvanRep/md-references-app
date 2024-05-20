import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../types/UserModel';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserControllerService {
  API_URL = '';
  user: UserModel | null = {
    id: 0,
    username: '',
    password: '',
  };
  userSubject = new Subject<UserModel | null>();

  constructor(private http: HttpClient) {
    this.userSubject.subscribe({
      next: (user: UserModel | null) => {
        this.user = user;
      },
    });
  }

  confirmUser(): void {
    if (!this.user) return;
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
    });
    const params: HttpParams = new HttpParams({
      fromObject: this.user,
    });
    this.http
      .get<UserModel>(this.API_URL, {
        headers: headers,
        params: params,
        responseType: 'json',
      })
      .subscribe({
        next: (user: UserModel) => {
          this.userSubject.next(user);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  createUser(): void {
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
    });
    this.http
      .post<UserModel>(this.API_URL, this.user, {
        headers: headers,
        responseType: 'json',
      })
      .subscribe({
        next: (user: UserModel) => {
          this.userSubject.next(user);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  updateUser(): void {
    if (!this.user) return;
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
    });
    this.http
      .put<UserModel>(this.API_URL, this.user, {
        headers: headers,
        responseType: 'json',
      })
      .subscribe({
        next: (user: UserModel) => {
          this.userSubject.next(user);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  deleteUser(): void {
    if (!this.user) return;
    const params: HttpParams = new HttpParams({
      fromObject: this.user,
    });
    this.http
      .delete(this.API_URL, {
        params: params,
        responseType: 'json',
      })
      .subscribe({
        next: (response: any) => {
          this.userSubject.next(null);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
}

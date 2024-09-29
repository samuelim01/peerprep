import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../_environments/environment';
import { User } from '../_models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.UserServiceApiUrl}/auth/login`, 
            { "username": username, "password": password })
            .pipe(map(response => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                const user = response.data;
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    createAccount(username: string, email: string, password: string) {
        return this.http.post<any>(`${environment.UserServiceApiUrl}/users`,
            { "username": username, "email": email, "password": password })
            .pipe(switchMap(() => this.login(username, password))); // auto login after registration
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }
}
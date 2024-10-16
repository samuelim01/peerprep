// Modified from https://jasonwatmore.com/post/2022/11/15/angular-14-jwt-authentication-example-tutorial#login-component-ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../_environments/environment';
import { User } from '../_models/user.model';
import { UServRes } from '../_models/user.service.response.interface';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject: BehaviorSubject<User | null | undefined>;
    public user$: Observable<User | null | undefined>;

    constructor(
        private router: Router,
        private http: HttpClient,
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user$ = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(username: string, password: string) {
        console.log('login', `${environment.UserServiceApiUrl}/auth/login`);
        return this.http
            .post<UServRes>(
                `${environment.UserServiceApiUrl}/auth/login`,
                { username: username, password: password },
                { observe: 'response' },
            )
            .pipe(
                map(response => {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    let user: User = {};
                    if (response.body) {
                        const body: UServRes = response.body;
                        const data = body.data;
                        user = {
                            id: data.id,
                            username: data.username,
                            email: data.email,
                            accessToken: data.accessToken,
                            isAdmin: data.isAdmin,
                            createdAt: data.createdAt,
                        };
                    }
                    localStorage.setItem('user', JSON.stringify(user));
                    this.userSubject.next(user);
                    return user;
                }),
            );
    }

    createAccount(username: string, email: string, password: string) {
        return this.http
            .post<UServRes>(
                `${environment.UserServiceApiUrl}/users`,
                { username: username, email: email, password: password },
                { observe: 'response' },
            )
            .pipe(switchMap(() => this.login(username, password))); // auto login after registration
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    // get user details from user service for authentication
    getUserDetails() {
        return this.http
            .get<UServRes>(`${environment.UserServiceApiUrl}/users/${this.userValue?.id}`, { observe: 'response' })
            .pipe(
                map(response => {
                    if (response.status === 200) {
                        let user: User = {};
                        if (response.body) {
                            const body: UServRes = response.body;
                            const data = body.data;
                            user = {
                                id: data.id,
                                username: data.username,
                                email: data.email,
                                accessToken: data.accessToken,
                                isAdmin: data.isAdmin,
                                createdAt: data.createdAt,
                            };
                        }
                        return user;
                    }
                    return null;
                }),
            );
    }
}

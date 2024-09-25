import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Question } from './question.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class QuestionService {
    constructor(private http: HttpClient) {}

    getList(): Observable<Question> {
        return this.http.get<Question>('https://lhp-command-center-webapi-dev.azurewebsites.net/api/sites/List');
    }
}

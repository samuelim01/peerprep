import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../api.config';
import { Observable } from 'rxjs';
import { QuestionResponse } from './question.model';
import { Topic, TopicResponse } from './topic.model';

@Injectable({
    providedIn: 'root',
})
export class QuestionService {
    private baseUrl = API_CONFIG.baseUrl;

    constructor(private http: HttpClient) {}

    getQuestions(
        title?: string,
        description?: string,
        topics?: string[],
        difficulty?: string,
    ): Observable<QuestionResponse> {
        let params = new HttpParams();

        if (title) {
            params = params.append('title', title);
        }
        if (description) {
            params = params.append('description', description);
        }
        if (topics && topics.length > 0) {
            params = params.append('topics', topics.join(','));
        }
        if (difficulty) {
            params = params.append('difficulty', difficulty);
        }

        // send request
        return this.http.get<QuestionResponse>(this.baseUrl + '/questions', { params });
    }

    getTopics(): Observable<TopicResponse> {
        return this.http.get<TopicResponse>(this.baseUrl + '/questions/topics');
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { historyResponse, MatchingHistory } from '../app/account/history/history.model';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root',
})
export class HistoryService extends ApiService {
    protected apiPath = 'history/history';

    constructor(private http: HttpClient) {
        super();
    }

    getHistories(): Observable<MatchingHistory[]> {
        return this.http.get<historyResponse>(`${this.apiUrl}`).pipe(
            map(response =>
                response.data.map(item => ({
                    id: item._id,
                    collaborator: item.collaborator.username,
                    question: item.question.title,
                    topics: item.question.topics,
                    difficulty: item.question.difficulty,
                    status: item.status,
                    time: item.createdAt,
                })),
            ),
        );
    }
}

import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { MatchingHistory } from './history.model';
import { HistoryService } from '../../../_services/history.service';
import { MessageService } from 'primeng/api';

@Component({
    standalone: true,
    imports: [
        TableModule,
        CommonModule,
    ],
    providers: [MessageService],
    templateUrl: './history.component.html',
    styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
    histories: MatchingHistory[] = [];
    loading = true;

    dummyHistories: MatchingHistory[] = [
        {
            id: 1,
            collaborator: 'userabc',
            question: 'Roman to Integer',
            difficulty: 'Easy',
            topics: ['Algorithms', 'Data Structures', 'Strings', 'Arrays'],
            status: 'COMPLETED',
            time: '2024-10-31T09:26:01.743Z',
        },
        {
            id: 2,
            collaborator: 'userdef',
            question: 'Two Sum',
            difficulty: 'Medium',
            topics: ['Data Structures'],
            status: 'FORFEITED',
            time: '2024-11-01T10:15:30.123Z',
        },
        {
            id: 3,
            collaborator: 'userghi',
            question: 'Longest Substring Without Repeating Characters',
            difficulty: 'Hard',
            topics: ['Strings'],
            status: 'COMPLETED',
            time: '2023-11-02T11:45:00.789Z',
        },
    ];

    constructor(
        private historyService: HistoryService,
        private messageService: MessageService,
    ) {}

    ngOnInit() {
        this.histories = this.dummyHistories;
        // this.historyService.getHistories().subscribe({
        //     next: (data) => {
        //         this.histories = data;
        //         this.loading = false;
        //     },
        //     error: () => {
        //         this.histories = [];
        //         this.loading = false;
        //         this.messageService.add({
        //             severity: 'error',
        //             summary: 'Error',
        //             detail: 'Failed to load data. Please try again later.',
        //             life: 3000,
        //         });
        //     },
        // });
    }
}

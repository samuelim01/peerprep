import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { MatchingHistory } from './history.model';
import { HistoryService } from '../../../_services/history.service';
import { MessageService } from 'primeng/api';

@Component({
    standalone: true,
    imports: [TableModule, CommonModule],
    providers: [MessageService],
    templateUrl: './history.component.html',
    styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
    histories: MatchingHistory[] = [];
    loading = true;

    constructor(
        private historyService: HistoryService,
        private messageService: MessageService,
    ) {}

    ngOnInit() {
        this.historyService.getHistories().subscribe({
            next: data => {
                this.histories = data;
                this.loading = false;
            },
            error: () => {
                this.histories = [];
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load data. Please try again later.',
                    life: 3000,
                });
            },
        });
    }
}

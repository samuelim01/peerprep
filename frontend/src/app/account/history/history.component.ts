import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule, DatePipe } from '@angular/common';
import { MatchingHistory } from './history.model';
import { HistoryService } from '../../../_services/history.service';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorState, Extension, StateEffect } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { languageMap, parserMap, LanguageOption } from '../../collaboration/editor/languages';

@Component({
    standalone: true,
    imports: [TableModule, CommonModule, InputTextModule, ButtonModule, IconFieldModule, InputIconModule, ],
    providers: [MessageService, DatePipe],
    templateUrl: './history.component.html',
    styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
    @ViewChild('editor') editor!: ElementRef;

    histories: MatchingHistory[] = [];
    loading = true;
    isPanelVisible = false;
    history: MatchingHistory | null = null;
    editorView: EditorView | null = null;

    constructor(
        private historyService: HistoryService,
        private messageService: MessageService,
        private datePipe: DatePipe,
    ) {}

    ngOnInit() {
        this.historyService.getHistories().subscribe({
            next: data => {
                this.histories = data.map(history => ({
                    ...history,
                    time: this.datePipe.transform(history.time, 'short') // Pipe to format date for searching
                }));
                this.loading = false;
                console.log(this.histories);
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

    onRowSelect(history: MatchingHistory) {
        this.history = history;
        this.isPanelVisible = true;
        if (history.code && history.language) {
            this.initializeEditor(history.code, history.language);
        }
    }

    closePanel() {
        this.isPanelVisible = false;
        this.history = null;
    }

    initializeEditor(code: string, language: string) {
        if (this.editor) {
            if (this.editorView) {
                this.editorView.destroy();
            }

            const languageExtension = languageMap[language] || languageMap["java"];
            const state = EditorState.create({
                doc: code,
                extensions: [
                    basicSetup,
                    languageExtension,
                    oneDark,
                ],
            });

            this.editorView = new EditorView({
                state,
                parent: this.editor.nativeElement,
            });
        }
    }
}

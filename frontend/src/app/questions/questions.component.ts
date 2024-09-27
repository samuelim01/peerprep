import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CommonModule, NgFor } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Question } from './question.model';
import { Column } from './column.model';
import { Topic } from './topic.model';
import { Difficulty } from './difficulty.model';
import { DifficultyLevels } from './difficulty-levels.enum';
import { QuestionService } from '../../_services/question.service';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { QuestionDialogComponent } from './question-dialog.component';

@Component({
    selector: 'app-questions',
    standalone: true,
    imports: [
        TableModule,
        NgFor,
        CommonModule,
        FormsModule,
        ToastModule,
        ToolbarModule,
        ButtonModule,
        ConfirmDialogModule,
        DialogModule,
        ButtonModule,
        ReactiveFormsModule,
        MultiSelectModule,
        DropdownModule,
        ProgressSpinnerModule,
        QuestionDialogComponent,
    ],
    providers: [QuestionService, ConfirmationService, MessageService],
    templateUrl: './questions.component.html',
    styleUrl: './questions.component.css',
})
export class QuestionsComponent implements OnInit {
    loading = true;

    questions: Question[] = [];

    topics!: Topic[];

    difficulties!: Difficulty[];

    questionFormGroup!: FormGroup;

    difficulty!: string;

    question!: Question;

    selectedQuestions!: Question[] | null;

    submitted = false;

    isDialogVisible = false;

    cols: Column[] = [];

    dialogHeader = '';

    constructor(
        private questionService: QuestionService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
    ) {}

    ngOnInit() {
        // two way binding for forms is not working for some reason unless question is initialised with empty values
        this.initQuestion();

        // fetch data from API call
        this.handleInitData();

        this.initDifficulties();
    }

    openNewQuestion() {
        this.dialogHeader = 'Create new question';
        this.question = {} as Question;
        this.submitted = false;
        this.isDialogVisible = true;
        console.log('isDialogVisible: ' + this.isDialogVisible);
    }

    editQuestion(question: Question) {
        this.dialogHeader = 'Edit Question';
        this.question = question;
        this.isDialogVisible = true;
    }

    deleteSelectedQuestions() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected questions?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.handleDeleteQuestionResponse();
            },
        });
    }

    initDifficulties() {
        this.difficulties = [
            { label: DifficultyLevels.EASY, value: DifficultyLevels.EASY },
            { label: DifficultyLevels.MEDIUM, value: DifficultyLevels.MEDIUM },
            { label: DifficultyLevels.HARD, value: DifficultyLevels.HARD },
        ];
    }

    initQuestion() {
        this.question = {
            id: -1,
            title: '',
            topics: [],
            description: '',
            difficulty: '',
        };
    }

    handleDeleteQuestionResponse() {
        const deleteRequests = this.selectedQuestions?.map(q => this.questionService.deleteQuestion(q.id));

        forkJoin(deleteRequests!).subscribe({
            next: () => {
                // delete locally
                this.questions = this.questions?.filter(val => !this.selectedQuestions?.includes(val));
                this.selectedQuestions = null;
            },
            error: (error: HttpErrorResponse) => {
                this.onErrorReceive('Some questions could not be deleted. ' + error.error.message);
            },
            complete: () => {
                this.onSuccessfulRequest('Question(s) Deleted');
            },
        });
    }

    handleInitData() {
        forkJoin({
            questions: this.questionService.getQuestions(),
            topics: this.questionService.getTopics(),
        }).subscribe({
            next: results => {
                this.questions = results.questions.data || [];
                this.topics =
                    results.topics.data?.map(topic => ({
                        label: topic,
                        value: topic,
                    })) || [];
            },
            error: () => {
                this.questions = [];
                this.topics = [];
                this.onErrorReceive('Failed to load data. Please try again later.');
            },
            complete: () => {
                this.loading = false;
            },
        });
    }

    onDialogClose() {
        this.isDialogVisible = false;
    }

    onQuestionUpdate(question: Question) {
        this.questions[this.questions.findIndex(x => x.id == question.id)] = question;
        this.questions = [...this.questions];
    }

    onQuestionAdd(question: Question) {
        this.questions = [...this.questions, question];
    }

    onErrorReceive(errorMessage: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 3000,
        });
    }

    onSuccessfulRequest(successMessage: string) {
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: successMessage,
            life: 3000,
        });
    }
}

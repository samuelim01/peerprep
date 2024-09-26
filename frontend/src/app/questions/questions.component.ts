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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { Question, SingleQuestionResponse, QuestionBody } from './question.model';
import { Column } from './column.model';
import { Topic } from './topic.model';
import { Difficulty } from './difficulty.model';
import { DifficultyLevels } from './difficulty-levels.enum';
import { QuestionService } from './question.service';
import { forkJoin } from 'rxjs';

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
    ],
    providers: [QuestionService, ConfirmationService, MessageService],
    templateUrl: './questions.component.html',
    styleUrl: './questions.component.css',
})
export class QuestionsComponent implements OnInit {
    questions: Question[] = [];

    topics!: Topic[];

    difficulties!: Difficulty[];

    questionFormGroup!: FormGroup;

    selectedDifficulty!: string;

    question!: Question;

    selectedQuestions!: Question[] | null;

    submitted = false;

    isDialogVisible = false;

    cols: Column[] = [];

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

        this.initFormGroup();

        this.initListeners();
    }

    openNewQuestion() {
        this.resetFormGroup();
        this.question = {} as Question;
        this.submitted = false;
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

    saveQuestion() {
        this.submitted = true;

        if (
            !this.question.title?.trim() ||
            !this.question.topics ||
            !this.question.difficulty?.trim() ||
            !this.question.description?.trim()
        ) {
            return;
        }

        if (this.question.id) {
            // update
            const { id, ...questionBody } = this.question;
            this.handleEditQuestionResponse(id, questionBody);
        } else {
            // add
            this.handleAddQuestionResponse();
        }

        this.isDialogVisible = false;
        this.question = {} as Question;
    }

    resetFormGroup() {
        this.questionFormGroup.reset({
            selectedTopics: [],
            selectedDifficulty: '',
            textTitle: '',
            textDescription: '',
        });
    }

    editQuestion(question: Question) {
        this.question.id = question.id;
        this.questionFormGroup.patchValue({
            textTitle: question.title,
            textDescription: question.description,
            selectedTopics: question.topics,
            selectedDifficulty: question.difficulty,
        });
        this.isDialogVisible = true;
    }

    initListeners() {
        // Dropdown difficulty listener
        this.questionFormGroup.get('selectedDifficulty')?.valueChanges.subscribe(v => {
            this.question.difficulty = v;
        });

        // Multiselect topics listener
        this.questionFormGroup.get('selectedTopics')?.valueChanges.subscribe(v => {
            this.question.topics = v;
        });

        // text title listener
        this.questionFormGroup.get('textTitle')?.valueChanges.subscribe(v => {
            this.question.title = v;
        });

        // text description listener
        this.questionFormGroup.get('textDescription')?.valueChanges.subscribe(v => {
            this.question.description = v;
        });
    }

    initFormGroup() {
        this.questionFormGroup = new FormGroup({
            selectedTopics: new FormControl<string[] | null>([]),
            selectedDifficulty: new FormControl<Difficulty[] | null>([]),
            textTitle: new FormControl<string | null>(''),
            textDescription: new FormControl<string | null>(''),
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

    handleAddQuestionResponse() {
        this.questionService.addQuestion(this.question).subscribe({
            next: (response: SingleQuestionResponse) => {
                if (this.questions) {
                    this.questions = [...this.questions, response.data];
                }
            },
            error: (error: Error) => {
                console.log(error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to add new question. Please try again later.',
                    life: 3000,
                });
            },
            complete: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'New Question Added',
                    life: 3000,
                });
            },
        });
    }

    handleDeleteQuestionResponse() {
        const deleteRequests = this.selectedQuestions?.map(q => this.questionService.deleteQuestion(q.id));

        forkJoin(deleteRequests!).subscribe({
            next: () => {
                // delete locally
                this.questions = this.questions?.filter(val => !this.selectedQuestions?.includes(val));
                this.selectedQuestions = null;
            },
            error: () => {
                // Handle any errors from the forkJoin if necessary
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Some questions could not be deleted. Please try again later.',
                    life: 3000,
                });
            },
            complete: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Question(s) Deleted',
                    life: 3000,
                });
            },
        });
    }

    handleEditQuestionResponse(id: number, question: QuestionBody) {
        this.questionService.updateQuestion(id, question).subscribe({
            next: (response: SingleQuestionResponse) => {
                this.questions[this.questions.findIndex(x => x.id == id)] = response.data;
            },
            error: (error: Error) => {
                console.log(error);
                console.log(question);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to edit question. Please try again later.',
                    life: 3000,
                });
            },
            complete: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Question has been updated successfully',
                    life: 3000,
                });
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
            error: (error: Error) => {
                console.error(error);
                this.questions = [];
                this.topics = [];
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load data. Please try again later.',
                    life: 3000,
                });
            },
            complete: () => {
                // TODO: add loading state for this
                console.log('complete');
            },
        });
    }
}

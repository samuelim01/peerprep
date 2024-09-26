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
import { Question, QuestionResponse } from './question.model';
import { Column } from './column.model';
import { Topic, TopicResponse } from './topic.model';
import { Difficulty } from './difficulty.model';
import { DifficultyLevels } from './difficulty-levels.enum';
import { QuestionService } from './question.service';

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
    questionResponse!: QuestionResponse;

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
        this.question = {
            _id: '',
            id: -1,
            title: '',
            topics: [],
            description: '',
            difficulty: '',
        };

        this.questionService.getQuestions().subscribe({
            next: (response: QuestionResponse) => {
                this.questions = response.data!;
            },
            error: (error: Error) => {
                // TODO: prompt an error on unsuccessful fetch
                console.log(error);
            },
            complete: () => {
                // TODO: add loading state for this
                console.log('complete');
            },
        });

        this.questionService.getTopics().subscribe({
            next: (response: TopicResponse) => {
                this.topics = response.data!.map(topic => ({
                    label: topic,
                    value: topic
                }))
            },
            error: (error: Error) => {
                // TODO: prompt an error on unsuccessful fetch
                console.log(error);
            },
            complete: () => {
                // TODO: add loading state for this
                console.log('complete');
            },
        });

        this.difficulties = [
            { label: DifficultyLevels.EASY, value: DifficultyLevels.EASY },
            { label: DifficultyLevels.MEDIUM, value: DifficultyLevels.MEDIUM },
            { label: DifficultyLevels.HARD, value: DifficultyLevels.HARD },
        ];

        this.questionFormGroup = new FormGroup({
            selectedTopics: new FormControl<string[] | null>([]),
            selectedDifficulty: new FormControl<Difficulty[] | null>([]),
            textTitle: new FormControl<string | null>(''),
            textDescription: new FormControl<string | null>(''),
        });

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
                this.questions = this.questions?.filter(val => !this.selectedQuestions?.includes(val));
                this.selectedQuestions = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Question(s) Deleted',
                    life: 3000,
                });
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
            if (this.questions) {
                this.questions[this.questions.findIndex(x => x.id == this.question.id)] = this.question;
            }

            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Question has been updated successfully',
                life: 3000,
            });
        } else {
            // add
            this.question.id = this.createId();

            if (this.questions) {
                this.questions = [...this.questions, this.question];
            }

            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'New Question Added',
                life: 3000,
            });
        }

        this.isDialogVisible = false;
        this.question = {} as Question;
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

    // assuming newest question is always appended at the back
    createId() {
        return this.questions ? Number(this.questions.at(-1)?.id) + 1 : -1;
    }

    resetFormGroup() {
        this.questionFormGroup.reset({
            selectedTopics: [],
            selectedDifficulty: '',
            textTitle: '',
            textDescription: '',
        });
    }
}

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
import questionData from './questions.json';
import { Question, Column, Topic, Difficulty } from './question.model';
import { DifficultyLevels } from './difficulty-levels.enum';

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
    providers: [ConfirmationService, MessageService],
    templateUrl: './questions.component.html',
    styleUrl: './questions.component.css',
})
export class QuestionsComponent implements OnInit {
    questions: Question[] = questionData;

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
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
    ) {}

    ngOnInit() {
        // two way binding for forms is not working for some reason unless question is initialised with empty values
        this.question = {
            title: '',
            topics: [],
            description: '',
            difficulty: '',
        };

        // Dummy data for topics
        this.topics = [
            { label: 'Arrays', value: 'Arrays' },
            { label: 'Dynamic Programming', value: 'Dynamic Programming' },
            { label: 'Greedy', value: 'Greedy' },
            { label: 'Hashset', value: 'Hashset' },
            { label: 'Sorting', value: 'Sorting' },
            { label: 'Algorithms', value: 'Algorithms' },
            { label: 'Bit Manipulation', value: 'Bit Manipulation' },
            { label: 'Brainteaser', value: 'Brainteaser' },
            { label: 'Data Structures', value: 'Data Structures' },
            { label: 'Databases', value: 'Databases' },
            { label: 'Recursion', value: 'Recursion' },
            { label: 'Strings', value: 'Strings' },
        ];

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
        this.question = {};
        this.submitted = false;
        this.isDialogVisible = true;
    }

    deleteSelectedQuestions() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected questions?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.questions = this.questions.filter(val => !this.selectedQuestions?.includes(val));
                this.selectedQuestions = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Questions Deleted',
                    life: 3000,
                });
            },
        });
    }

    saveQuestion() {
        this.submitted = true;
        console.log(this.question);
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
            this.questions[this.questions.findIndex(x => x.id == this.question.id)] = this.question;
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Question has been updated successfully',
                life: 3000,
            });
        } else {
            // add
            this.question.id = this.createId();
            this.questions = [...this.questions, this.question];
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'New Question Added',
                life: 3000,
            });
        }

        this.isDialogVisible = false;
        this.question = {};
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
        console.log(this.questions);
        return Number(this.questions.at(-1)?.id) + 1;
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

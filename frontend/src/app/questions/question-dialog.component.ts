import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Question, QuestionBody, SingleQuestionResponse } from './question.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { QuestionService } from '../../_services/question.service';
import { Difficulty } from './difficulty.model';
import { Topic } from './topic.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-question-dialog',
    standalone: true,
    imports: [
        ButtonModule,
        DialogModule,
        ButtonModule,
        ReactiveFormsModule,
        MultiSelectModule,
        DropdownModule,
        QuestionDialogComponent,
    ],
    providers: [QuestionService, ConfirmationService, MessageService],
    templateUrl: './question-dialog.component.html',
    styleUrl: './question-dialog.component.css',
})
export class QuestionDialogComponent implements OnInit {
    @Input() question!: Question;
    @Input() headerMessage!: string;
    @Input() isDialogVisible = false;
    @Input() topics!: Topic[];
    @Input() difficulties!: Difficulty[];
    @Output() dialogClose = new EventEmitter<void>();
    @Output() questionUpdate = new EventEmitter<Question>();
    @Output() questionAdd = new EventEmitter<Question>();
    @Output() errorReceive = new EventEmitter<string>();
    @Output() successfulRequest = new EventEmitter<string>();

    questionFormGroup!: FormGroup;

    submitted = false;

    questions: Question[] = [];

    constructor(private questionService: QuestionService) {}

    ngOnInit(): void {
        this.initFormGroup();
    }

    get isTitleInvalid(): boolean {
        const titleControl = this.questionFormGroup.controls['title'];
        return titleControl.dirty && titleControl.invalid;
    }

    get isDescriptionInvalid(): boolean {
        const descriptionControl = this.questionFormGroup.controls['description'];
        return descriptionControl.dirty && descriptionControl.invalid;
    }

    get isDifficultyInvalid(): boolean {
        const difficultyControl = this.questionFormGroup.controls['difficulty'];
        return difficultyControl.dirty && difficultyControl.invalid;
    }

    get isTopicsInvalid(): boolean {
        const topicsControl = this.questionFormGroup.controls['topics'];
        return topicsControl.dirty && topicsControl.invalid;
    }

    saveQuestion() {
        this.submitted = true;

        if (!this.questionFormGroup.valid) {
            return;
        }

        if (this.question.id) {
            // update
            this.handleEditQuestionResponse(this.question.id, this.questionFormGroup.value);
        } else {
            // add
            this.handleAddQuestionResponse();
        }

        this.dialogClose.emit();
        this.question = {} as Question;
    }

    cancel() {
        this.resetFormGroup();
        this.dialogClose.emit();
    }

    show() {
        this.setFormValue();
    }

    handleEditQuestionResponse(id: number, question: QuestionBody) {
        this.questionService.updateQuestion(id, question).subscribe({
            next: (response: SingleQuestionResponse) => {
                this.questionUpdate.emit(response.data);
            },
            error: (error: HttpErrorResponse) => {
                this.errorReceive.emit(error.error.message);
            },
            complete: () => {
                this.successfulRequest.emit('Question has been updated successfully');
            },
        });
    }

    handleAddQuestionResponse() {
        this.questionService.addQuestion(this.questionFormGroup.value).subscribe({
            next: (response: SingleQuestionResponse) => {
                this.questionAdd.emit(response.data);
            },
            error: (error: HttpErrorResponse) => {
                this.errorReceive.emit('Failed to add new question. ' + error.error.message);
            },
            complete: () => {
                this.successfulRequest.emit('New Question Added');
            },
        });
    }

    initFormGroup() {
        this.questionFormGroup = new FormGroup({
            topics: new FormControl<string[] | null>([], [Validators.required]),
            difficulty: new FormControl<Difficulty[] | null>([], [Validators.required]),
            title: new FormControl<string | null>('', [Validators.required]),
            description: new FormControl<string | null>('', [Validators.required]),
        });
    }

    setFormValue() {
        this.questionFormGroup.patchValue({
            title: this.question.title,
            description: this.question.description,
            topics: this.question.topics,
            difficulty: this.question.difficulty,
        });
    }

    resetFormGroup() {
        this.questionFormGroup.reset({
            topics: [],
            difficulty: '',
            title: '',
            description: '',
        });
    }
}

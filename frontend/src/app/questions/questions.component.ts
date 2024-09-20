import { Component, NgModule, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CommonModule, NgFor } from '@angular/common'
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

interface Question {
    id?: number;
    title?: string;
    description?: string;
    topics?: string[];
    difficulty?: string;
}

interface Column {
    field: string;
    header: string;
}

interface Topic {
    label: string;
    value: string;
}

interface Difficulty {
    label: string;
    value: string;
}

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [TableModule, NgFor, CommonModule, FormsModule, ToastModule, ToolbarModule, ButtonModule, ConfirmDialogModule, DialogModule, ButtonModule, ReactiveFormsModule, MultiSelectModule, DropdownModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})

export class QuestionsComponent implements OnInit {
    questions: Question[] = [
        {
            id: 1,
            title: "Reverse a String",
            description: "Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.\n\n\nExample 1:\n\nInput: s = [\"h\",\"e\",\"l\",\"l\",\"o\"]\nOutput: [\"o\",\"l\",\"l\",\"e\",\"h\"]\n\nExample 2:\nInput: s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]\nOutput: [\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]\n\nConstraints:\n1 <= s.length <= 105 s[i] is a printable ascii character.",
            topics: ["Strings", "Algorithms"],
            difficulty: "Easy"
        },
        {
            id: 2,
            title: "Linked List Cycle Detection",
            description: "Implement a function to detect if a linked list contains a cycle.",
            topics: ["Data Structures", "Algorithms"],
            difficulty: "Easy"
        }
    ];

    topics!: Topic[];

    difficulties!: Difficulty[];

    questionFormGroup!: FormGroup;

    selectedDifficulty!: string;
    
    question!: Question;

    selectedQuestions!: Question[] | null;

    submitted: boolean = false;

    isDialogVisible: boolean = false;

    cols: Column[] = [];


    constructor(private messageService: MessageService, private confirmationService: ConfirmationService) {}
    ngOnInit() {
        // two way binding for forms is not working for some reason unless question is initialised with empty values
        this.question = {
            title: '',
            topics: [],
            description: '',
            difficulty: ''
        };

        this.topics = [
            { label: 'Arrays', value: 'Arrays'},
            { label: 'Dynamic Programming', value: 'Dynamic Programming'},
            { label: 'Greedy', value: 'Greedy'},
            { label: 'Hashset', value: 'Hashset'},
            { label: 'Sorting', value: 'Sorting'}
        ];

        this.difficulties = [
            { label: 'Easy', value: 'Easy'},
            { label: 'Medium', value: 'Medium'},
            { label: 'Hard', value: 'Hard'},
        ]
        this.questionFormGroup = new FormGroup({
            selectedTopics: new FormControl<Topic[] | null>([]),
            selectedDifficulty: new FormControl<Difficulty[] | null>([]),
            textTitle: new FormControl<string | null>(''),
            textDescription: new FormControl<string | null>('')
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
                this.questions = this.questions.filter((val) => !this.selectedQuestions?.includes(val));
                this.selectedQuestions = null;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Questions Deleted', life: 3000 });
            },
        });
    }

    saveQuestion() {
        this.submitted = true;
        
        if(!this.question.title?.trim() || 
            !this.question.topics ||
            !this.question.difficulty?.trim() || 
            !this.question.description?.trim()) {
            return;
        }

        this.isDialogVisible = false
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'New Question Added', life: 3000 });
        this.question = {};
    }
}

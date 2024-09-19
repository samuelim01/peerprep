import { Component, NgModule, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CommonModule, NgFor } from '@angular/common'
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

interface Question {
    id: number;
    title: string;
    description: string;
    topics: string[];
    difficulty: string;
}

interface Column {
    field: string;
    header: string;
}

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [TableModule, NgFor, CommonModule, FormsModule, ToastModule, ToolbarModule, ButtonModule, ConfirmDialogModule],
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
    
    question!: Question;

    selectedQuestions!: Question[] | null;

    submitted: boolean = false;

    questionDialog: boolean = false;

    cols: Column[] = [];

    constructor(private messageService: MessageService, private confirmationService: ConfirmationService) {}

    ngOnInit() {

    }

    openNew() {
        this.question = {} as Question;
        this.submitted = false;
        this.questionDialog = true;
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
        console.log("save question");
    }
}

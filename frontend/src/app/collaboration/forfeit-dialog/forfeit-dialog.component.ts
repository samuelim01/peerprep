import { Component, EventEmitter, Input, Output, OnInit, input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { CollabService } from '../../../_services/collab.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import * as Y from 'yjs';

@Component({
    selector: 'app-forfeit-dialog',
    standalone: true,
    imports: [DialogModule, ButtonModule, ProgressSpinnerModule],

    templateUrl: './forfeit-dialog.component.html',
    styleUrl: './forfeit-dialog.component.css',
})
export class ForfeitDialogComponent implements OnInit {
    @Input() roomId!: string;
    @Input() isVisible = false;
    @Input() yforfeit!: Y.Map<boolean>;
    @Input() selectedLanguage!: string;
    @Input() yeditorText!: Y.Text;

    @Output() dialogClose = new EventEmitter<void>();
    @Output() notify = new EventEmitter<void>();

    message!: string;
    isForfeit = false;
    userId!: string;
    hideButtons = false;
    code!: string;

    constructor(
        private authService: AuthenticationService,
        private collabService: CollabService,
        private router: Router,
    ) {}
    ngOnInit() {
        this.getUserId();
        this.setMessage();
        this.initDocListener();
    }

    getUserId() {
        this.userId = this.authService.userValue?.id || '';
    }

    initDocListener() {
        this.yforfeit.observe(() => {
            const numForfeit = this.yforfeit.size;
            const isQuitter = this.yforfeit.entries().next().value[0] == this.userId;

            if (!isQuitter && numForfeit == 1) {
                this.message = 'Are you sure you want to forfeit?';
                this.notify.emit();
            }
        });
    }

    setMessage() {
        this.message = 'Are you sure you want to forfeit?\n\nForfeiting would result in your peer working alone.';
    }

    onForfeit() {
        this.code = this.yeditorText.toString();
        const userId = this.authService.userValue?.id;
        console.log('Forfeiting language:', this.selectedLanguage);
        console.log('Forfeiting code:', this.code);
        if (userId) {
            this.collabService.forfeit(this.roomId, this.selectedLanguage, this.code).subscribe({
                next: () => {
                    this.yforfeit.set(userId, true);
                    this.message = 'You have forfeited. \n\n Redirecting you to homepage...';
                    this.isForfeit = true;
                    this.hideButtons = true;
                    setTimeout(() => {
                        this.router.navigate(['/home']);
                    }, 1500);
                },
            });
        }
    }

    onCancel() {
        this.dialogClose.emit();
    }
}

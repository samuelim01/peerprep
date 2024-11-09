import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../../../_services/authentication.service';
import { User } from '../../../_models/user.model';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { invalidUsernameValidator } from '../_validators/invalid-username.validator';
import { mismatchPasswordValidator } from '../_validators/mismatch-password.validator';
import { invalidPasswordValidator } from '../_validators/invalid-password.validator';
import { lowercasePasswordValidator } from '../_validators/lowercase-password';
import { uppercasePasswordValidator } from '../_validators/uppercase-password';
import { numericPasswordValidator } from '../_validators/numeric-password';
import { specialPasswordValidator } from '../_validators/special-password';
import { shortPasswordValidator } from '../_validators/short-password';
import { weakPasswordValidator } from '../_validators/weak-password.validator';
import { FormUtilsService } from '../../../_services/form.utils.service';
import { Router } from '@angular/router';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        PasswordModule,
        ToastModule,
        DividerModule,
        InputTextModule,
    ],
    providers: [MessageService],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
    user: User | null = null;
    showEditProfile = false;
    showEditPassword = false;
    isProcessingEdit = false;
    isProcessingPassword = false;

    constructor(
        private authenticationService: AuthenticationService,
        private messageService: MessageService,
        private router: Router,
        public formUtils: FormUtilsService,
    ) {}

    editProfileForm: FormGroup = new FormGroup({
        username: new FormControl('', [Validators.required, invalidUsernameValidator()]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),
    });

    editPasswordForm: FormGroup = new FormGroup(
        {
            oldPassword: new FormControl('', [Validators.required]),
            password: new FormControl('', [
                Validators.required,
                invalidPasswordValidator(),
                lowercasePasswordValidator(),
                uppercasePasswordValidator(),
                numericPasswordValidator(),
                specialPasswordValidator(),
                shortPasswordValidator(),
                weakPasswordValidator(),
            ]),
            confirmPassword: new FormControl('', [Validators.required]),
        },
        {
            validators: mismatchPasswordValidator('password', 'confirmPassword'),
        },
    );

    passwordRequirements = [
        { msg: 'At least one lowercase', check: () => this.formUtils.passwordHasNoLowercase(this.editPasswordForm) },
        { msg: 'At least one uppercase', check: () => this.formUtils.passwordHasNoUppercase(this.editPasswordForm) },
        { msg: 'At least one numeric', check: () => this.formUtils.passwordHasNoNumeric(this.editPasswordForm) },
        {
            msg: 'At least one special character',
            check: () => this.formUtils.passwordHasNoSpecial(this.editPasswordForm),
        },
        { msg: 'Minimum 8 characters', check: () => this.formUtils.isPasswordShort(this.editPasswordForm) },
    ];

    ngOnInit() {
        this.user = this.authenticationService.userValue;
        this.showEditProfile = false;
        this.showEditPassword = false;
        this.isProcessingEdit = false;
        this.isProcessingPassword = false;
    }

    onUpdateProfile() {
        this.showEditProfile = true;
        this.showEditPassword = false;
    }

    onUpdatePassword() {
        this.showEditPassword = true;
        this.showEditProfile = false;
    }

    onEditSubmit() {
        if (this.editProfileForm.valid) {
            this.isProcessingEdit = true;

            // Check if password is correct first
            this.authenticationService
                .login(this.user!.username, this.editProfileForm.get('password')?.value)
                .subscribe({
                    next: () => {
                        this.authenticationService
                            .updateAccount(
                                this.editProfileForm.get('username')?.value,
                                this.editProfileForm.get('email')?.value,
                                this.editProfileForm.get('password')?.value,
                            )
                            .subscribe({
                                next: () => {
                                    this.router.navigateByUrl('/account', { skipLocationChange: true }).then(() => {
                                        this.router.navigate(['/account/profile']);
                                    });
                                },
                                error: error => {
                                    this.isProcessingEdit = false;
                                    const status = error.cause.status;
                                    let errorMessage = 'An unknown error occurred';
                                    if (status === 401) {
                                        errorMessage = 'Try loging out and log back in. Expired token';
                                    } else if (status === 404) {
                                        errorMessage = 'Try loging out and log back in. User ID Not Found';
                                    } else if (status === 409) {
                                        errorMessage = 'Username or Email already exists';
                                    } else if (status === 500) {
                                        errorMessage = 'Internal Server Error';
                                    }
                                    this.messageService.add({
                                        severity: 'error',
                                        summary: 'Editing Profile Erorr',
                                        detail: errorMessage,
                                    });
                                },
                            });
                    },
                    error: error => {
                        this.isProcessingEdit = false;
                        const status = error.cause.status;
                        let errorMessage = 'An unknown error occurred';
                        if (status === 400) {
                            errorMessage = 'Missing Fields';
                        } else if (status === 401) {
                            errorMessage = 'Invalid username or password';
                        } else if (status === 500) {
                            errorMessage = 'Internal Server Error';
                        }
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Submission Error',
                            detail: errorMessage,
                        });
                    },
                });
        }
    }

    onPasswordSubmit() {
        if (this.editPasswordForm.valid) {
            this.isProcessingPassword = true;

            // Check if password is correct first
            this.authenticationService
                .login(this.user!.username, this.editPasswordForm.get('oldPassword')?.value)
                .subscribe({
                    next: () => {
                        this.authenticationService
                            .updateAccount(
                                this.user!.username,
                                this.user!.email,
                                this.editPasswordForm.get('password')?.value,
                            )
                            .subscribe({
                                next: () => {
                                    this.router.navigateByUrl('/account', { skipLocationChange: true }).then(() => {
                                        this.router.navigate(['/account/profile']);
                                    });
                                },
                                error: error => {
                                    this.isProcessingPassword = false;
                                    const status = error.cause.status;
                                    let errorMessage = 'An unknown error occurred';
                                    if (status === 401) {
                                        errorMessage = 'Try loging out and log back in. Expired token';
                                    } else if (status === 404) {
                                        errorMessage = 'Try loging out and log back in. User ID Not Found';
                                    } else if (status === 409) {
                                        errorMessage = 'Username or Email already exists';
                                    } else if (status === 500) {
                                        errorMessage = 'Internal Server Error';
                                    }
                                    this.messageService.add({
                                        severity: 'error',
                                        summary: 'Editing Password Erorr',
                                        detail: errorMessage,
                                    });
                                },
                            });
                    },
                    error: error => {
                        this.isProcessingPassword = false;
                        const status = error.cause.status;
                        let errorMessage = 'An unknown error occurred';
                        if (status === 400) {
                            errorMessage = 'Missing Fields';
                        } else if (status === 401) {
                            errorMessage = 'Invalid username or password';
                        } else if (status === 500) {
                            errorMessage = 'Internal Server Error';
                        }
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Submission Error',
                            detail: errorMessage,
                        });
                    },
                });
        }
    }
}

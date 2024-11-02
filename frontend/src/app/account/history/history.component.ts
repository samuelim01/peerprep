import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../../../_services/authentication.service';

@Component({
    standalone: true,
    imports: [],
    providers: [MessageService],
    templateUrl: './history.component.html',
    styleUrl: './history.component.css',
})
export class HistoryComponent {
    constructor(
        private authenticationService: AuthenticationService,
    ) {}

}

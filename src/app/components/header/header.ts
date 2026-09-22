import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule
    ],
    styleUrl: './header.sass',
    templateUrl: './header.html',
})
export class Header {
    public currentRoute: string = window.location.pathname;

    public updateCurrentRoute(route: string): string {
       return this.currentRoute = route;
    }
}

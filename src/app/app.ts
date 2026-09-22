import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        Header,
        RouterOutlet
    ],
    styleUrl: './app.sass',
    templateUrl: './app.html',
})
export class App {}

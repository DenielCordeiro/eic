import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { filter, Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        RouterLink,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule
    ],
    styleUrl: './header.sass',
    templateUrl: './header.html',
})
export class Header implements OnInit, OnDestroy {
    private router: Router = inject(Router);
    private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    private routeSub!: Subscription;
    public currentRoute: string = '';

    ngOnInit(): void {
        // 1. Pega a rota se ela já estiver disponível
        this.currentRoute = this.router.url;

        // 2. Escuta quando a navegação realmente CONCLUI (NavigationEnd)
        this.routeSub = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: any) => {
                this.currentRoute = event.urlAfterRedirects || event.url;
                // Força o Angular a atualizar o HTML no mesmo ciclo de renderização
                this.cdr.detectChanges();
            });
    }

    ngOnDestroy(): void {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}

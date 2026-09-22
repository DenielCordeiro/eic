import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { InventoryService } from '../../services/inventory.service';

import { Machine } from '../../models/machine';

@Component({
    selector: 'app-machines',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    styleUrl: './machines.sass',
    templateUrl: './machines.html',
})
export class Machines {
    machines = signal<Machine[]>([]);
    loading = signal<boolean>(true);
    error = signal<string | null>(null);

    constructor(private inventoryService: InventoryService) {}

    ngOnInit(): void {
        this.carregarMaquinas();
    }

    carregarMaquinas(): void {
        this.loading.set(true);
        this.inventoryService.getMachines().subscribe({
            next: (data) => {
                this.machines.set(data);
                console.log('Inventário de máquinas carregado com sucesso:', data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Erro ao buscar inventário:', err);
                this.error.set('Não foi possível carregar o inventário.');
                this.loading.set(false);
            }
        });
    }
}

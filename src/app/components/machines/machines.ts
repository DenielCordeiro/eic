import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { InventoryService } from '../../services/inventory.service';
import { MachineInterface } from '../../interfaces/machine.interface';

import { Machine } from './machine/machine';

@Component({
    selector: 'app-machines',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatDialogModule
    ],
    styleUrl: './machines.sass',
    templateUrl: './machines.html',
})
export class Machines {
    machines = signal<MachineInterface[]>([]);
    loading = signal<boolean>(true);
    error = signal<string | null>(null);

    constructor(
        private inventoryService: InventoryService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.loadMachines(false);
    }

    loadMachines(forceRefresh: boolean): void {
        this.loading.set(true);
        this.error.set(null);

        this.inventoryService.getMachines(forceRefresh)
            .then((data) => {
                this.machines.set(data);
                this.loading.set(false);
            })
            .catch(error => {
                console.error('Erro ao buscar inventário:', error);
                this.error.set('Não foi possível carregar o inventário.');
                this.loading.set(false);
            })
    }

    public openMachineDetails(machine: MachineInterface): void {
        const dialogRef = this.dialog.open(Machine, {
            data: machine
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.loadMachines(result);
        });
    }
}

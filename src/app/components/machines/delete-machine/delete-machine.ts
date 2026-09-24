import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { InventoryService } from '../../../services/inventory.service';
import { MachineInterface } from '../../../interfaces/machine.interface';

@Component({
    selector: 'app-delete-machine',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule
    ],
    styleUrl: './delete-machine.sass',
    templateUrl: './delete-machine.html',
})
export class DeleteMachine {
    private inventoryService: InventoryService = inject(InventoryService)
    constructor(
        public dialogRef: MatDialogRef<DeleteMachine>,
        @Inject(MAT_DIALOG_DATA) public data: MachineInterface // Dados da máquina
    ) {
        console.log('Dados da máquina para excluir:', this.data);
    }

    public delitingMachine(): void {
        this.inventoryService.deleteMachine(this.data.Nome_da_Maquina).subscribe({
            next: () => {
                alert('Máquina excluida com sucesso!');
            },
            error: (err) => {
                console.error('Erro ao cadastrar máquina:', err);
                alert('Ocorreu um erro ao salvar os dados.');
            }
        });
    }

    public cancel(): void {
        this.dialogRef.close(false);
    }
}

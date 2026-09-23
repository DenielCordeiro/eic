import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MachineInterface } from '../../../models/machine.interface';

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
    constructor(
        public dialogRef: MatDialogRef<DeleteMachine>,
        @Inject(MAT_DIALOG_DATA) public data: MachineInterface // Dados da máquina
    ) {
        console.log('Dados da máquina para excluir:', this.data);
    }

    public save(): void {
        this.dialogRef.close(true);
    }

    public cancel(): void {
        this.dialogRef.close(false);
    }
}

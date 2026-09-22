import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

import { MachineInterface } from '../../../models/machine.interface';

@Component({
    selector: 'app-delete-machine',
     standalone: true,
    imports: [
        MatDialogModule,
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

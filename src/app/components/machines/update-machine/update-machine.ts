import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

import { MachineInterface } from '../../../models/machine.interface';

@Component({
    selector: 'app-update-machine',
    standalone: true,
    imports: [
        MatDialogModule,
    ],
    styleUrl: './update-machine.sass',
    templateUrl: './update-machine.html',
})
export class UpdateMachine {
    constructor(
        public dialogRef: MatDialogRef<UpdateMachine>,
        @Inject(MAT_DIALOG_DATA) public data: MachineInterface // Dados da máquina
    ) {
        console.log('Dados da máquina para editar:', this.data);
    }

    public save(): void {
        this.dialogRef.close(true);
    }

    public cancel(): void {
        this.dialogRef.close(false);
    }
}

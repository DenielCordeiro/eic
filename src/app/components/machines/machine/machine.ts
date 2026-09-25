import { Component, Inject, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MachineInterface } from '../../../interfaces/machine.interface';

import { UpdateMachine } from '../update-machine/update-machine';
import { DeleteMachine } from '../delete-machine/delete-machine';

@Component({
    selector: 'app-machine',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule
    ],
    styleUrl: './machine.sass',
    templateUrl: './machine.html',
})
export class Machine {
    updateListMachines: Signal<boolean> = signal(false);

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: MachineInterface,
        public dialogRef: MatDialogRef<Machine>,
        private dialog: MatDialog
    ) {
        console.log('Dados da máquina para excluir:', this.data);
    }

    public updatingMachine(): void {
        const dialogRef = this.dialog.open(UpdateMachine, {
            data: this.data
        });

        dialogRef.afterClosed().subscribe((updated: boolean) => {
            if (updated == true) {
                this.dialogRef.close(true);
            }
        });
    }

    public deletingMachine(): void {
        const dialogRef = this.dialog.open(DeleteMachine, {
            data: this.data
        });

        dialogRef.afterClosed().subscribe((deleted) => {
            if (deleted == true) {
                this.dialogRef.close(true);
            }
        });
    }

    public cancel(): void {
        this.dialogRef.close(false);
    }
}

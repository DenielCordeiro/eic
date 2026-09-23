import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { InventoryService } from '../../../services/inventory.service';
import { MachineInterface } from '../../../models/machine.interface';

@Component({
    selector: 'app-update-machine',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule
    ],
    styleUrl: './update-machine.sass',
    templateUrl: './update-machine.html',
})
export class UpdateMachine implements OnInit {
    private formBuilder = inject(FormBuilder);
    private inventoryService = inject(InventoryService);
    public machineForm!: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<UpdateMachine>,
        @Inject(MAT_DIALOG_DATA) public data: MachineInterface // Dados da máquina
    ) {
        console.log('Dados da máquina para editar:', this.data);
    }

    ngOnInit(): void {
        this.machineForm = this.buildForm();
    }

    private buildForm(): FormGroup {
        return this.formBuilder.group({
            Usuario: [''],
            Email: ['', Validators.email],
            Nome_da_Maquina: [''],
            Sistema_Operacional: [''],
            Placa_mae: [''],
            Processador: [''],
            Armazenamento: [''],
            Placa_de_Video: [''],
            Conector_de_Rede: [''],
            Quantidade_de_RAM: [''],
            Geracao_da_RAM: [''],
            Termo: ['']
        });
    }

    public onSubmit(): void {
        if (this.machineForm.valid) {
            this.inventoryService.updateMachine(this.machineForm.value).subscribe({
                next: () => {
                    alert('Máquina atualizada com sucesso!');
                },
                error: (err) => {
                    console.error('Erro ao cadastrar máquina:', err);
                    alert('Ocorreu um erro ao salvar os dados.');
                }
            });
        }
    }

    public save(): void {
        this.dialogRef.close(true);
    }

    public cancel(): void {
        this.dialogRef.close(false);
    }
}

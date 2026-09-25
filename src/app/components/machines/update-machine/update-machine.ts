import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { InventoryService } from '../../../services/inventory.service';
import { MachineInterface } from '../../../interfaces/machine.interface';

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
        @Inject(MAT_DIALOG_DATA) public data: MachineInterface
    ) {}

    ngOnInit(): void {
        this.machineForm = this.buildForm();
    }

    private buildForm(): FormGroup {
        return this.machineForm = this.formBuilder.group({
            Usuario: [this.data?.Usuario || ''],
            Email: [this.data?.Email || ''],
            Nome_da_Maquina: [{ value: this.data?.Nome_da_Maquina || '', disabled: true }, [Validators.required]], // Nome como chave primária (desabilitado para edição)
            Sistema_Operacional: [this.data?.Sistema_Operacional || ''],
            Placa_mae: [this.data?.Placa_mae || ''],
            Processador: [this.data?.Processador || ''],
            Armazenamento: [this.data?.Armazenamento || ''],
            Placa_de_Video: [this.data?.Placa_de_Video || ''],
            Conector_de_Rede: [this.data?.Conector_de_Rede || ''],
            Quantidade_de_RAM: [this.data?.Quantidade_de_RAM || ''],
            Geracao_da_RAM: [this.data?.Geracao_da_RAM || ''],
            Termo: [this.data?.Termo || '']
        });
    }

    public onSubmit(): void {
        if (this.machineForm.valid) {
            const updatedData: MachineInterface = this.machineForm.getRawValue();

            this.inventoryService.updateMachine(updatedData)
                .then(response => {
                    console.log(response)
                    this.inventoryService.getMachines();
                    this.dialogRef.close(true);
                })
                .catch((err) => {
                    console.error('Erro ao cadastrar máquina:', err);
                    alert('Ocorreu um erro ao salvar os dados.');
                })
        }
    }

    public cancel(): void {
        this.dialogRef.close(false);
    }
}

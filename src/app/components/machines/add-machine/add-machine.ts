import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { InventoryService } from '../../../services/inventory.service';

@Component({
    selector: 'app-add-machine',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule
    ],
    styleUrl: './add-machine.sass',
    templateUrl: './add-machine.html',
})
export class AddMachine implements OnInit {
    private formBuilder = inject(FormBuilder);
    private inventoryService = inject(InventoryService);
    public machineForm!: FormGroup;

    ngOnInit(): void {
        this.machineForm = this.buildForm();
    }

    public buildForm(): FormGroup {
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

    onSubmit(): void {
        if (this.machineForm.valid) {
            this.inventoryService.addMachine(this.machineForm.value)
                .then(response => {
                    console.log('Máquina atualizada com sucesso:', response);
                    this.machineForm.reset();
                    this.inventoryService.getMachines();
                })
                .catch(error => {
                    console.log('Mensagem de erro:', error);
                })
        }
    }
}

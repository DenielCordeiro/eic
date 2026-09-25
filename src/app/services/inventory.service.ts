import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';

import { environment } from '../../environments/environment.prod';

import { MachineInterface } from '../interfaces/machine.interface';
import { ResponseInterface } from '../interfaces/response.interface';

@Injectable({
    providedIn: 'root'
})
export class InventoryService {
    private readonly apiUrl: string = environment.machinesInventoryUrl;
    private readonly CACHE_KEY: string = 'inventario_maquinas_cache';

    private machinesSubject = new BehaviorSubject<MachineInterface[]>(this.getInitialCache());
    public machinesInCache: Observable<MachineInterface[]> = this.machinesSubject.asObservable();

    constructor(private http: HttpClient) {}


    private getInitialCache(): MachineInterface[] {
        const cached = localStorage.getItem(this.CACHE_KEY);
        return cached ? JSON.parse(cached) : [];
    }

    private setCache(data: MachineInterface[]): void {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
        this.machinesSubject.next(data);
    }

    public get currentMachinesValue(): MachineInterface[] {
        return this.machinesSubject.value;
    }

    public async getMachines(forceRefresh = false): Promise<MachineInterface[]> {
        if (this.machinesSubject.value.length > 0 && !forceRefresh) {
            return this.machinesSubject.value;
        }

        return this.refreshMachinesFromApi();
    }

    public async refreshMachinesFromApi(): Promise<MachineInterface[]> {
        const request$ = this.http.get<MachineInterface[]>(this.apiUrl);
        const data = await lastValueFrom(request$);
        this.setCache(data);

        return data;
    }

    public async addMachine(newMachine: MachineInterface): Promise<ResponseInterface> {
        const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });
        const payload = { action: 'create', ...newMachine };

        const request$ = this.http.post<ResponseInterface>(this.apiUrl, JSON.stringify(payload), { headers });
        const response = await lastValueFrom(request$);

        const currentList = this.machinesSubject.value;
        this.setCache([...currentList, newMachine]);

        console.log("resposta de máquina criada: ", response)

        return response;
    }

    public async updateMachine(updatedMachine: MachineInterface): Promise<ResponseInterface> {
        const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });
        const payload = { action: 'update', ...updatedMachine };

        const request$ = this.http.post<ResponseInterface>(this.apiUrl, JSON.stringify(payload), { headers });
        const response = await lastValueFrom(request$);

        const currentList = this.machinesSubject.value;
        const updatedList = currentList.map((machine) =>
            machine.Nome_da_Maquina === updatedMachine.Nome_da_Maquina ? updatedMachine : machine
        );
        this.setCache(updatedList);

        return response;
    }

    public async deleteMachine(machineName: string): Promise<ResponseInterface> {
        const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });
        const payload = { action: 'delete', Nome_da_Maquina: machineName };

        const request$ = this.http.post<ResponseInterface>(this.apiUrl, JSON.stringify(payload), { headers });
        const response = await lastValueFrom(request$);

        const currentList = this.machinesSubject.value;
        const filteredList = currentList.filter((machine) => machine.Nome_da_Maquina !== machineName);
        this.setCache(filteredList);

        return response;
    }
}

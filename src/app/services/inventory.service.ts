import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { MachineInterface } from '../interfaces/machine.interface';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
    private readonly apiUrl: string = environment.machinesInventoryUrl;
    private readonly CACHE_KEY: string = 'inventario_maquinas_cache';

    // Gerenciamento de estado local das máquinas
    private machinesSubject = new BehaviorSubject<MachineInterface[]>(this.getInitialCache());
    public machinesInCache = this.machinesSubject.asObservable();

    constructor(private http: HttpClient) {}

    // Busca do localStorage ao instanciar o serviço
    private getInitialCache(): MachineInterface[] {
        const cached = localStorage.getItem(this.CACHE_KEY);
        return cached ? JSON.parse(cached) : [];
    }

    // Atualiza o Subject e o localStorage simultaneamente
    private setCache(data: MachineInterface[]): void {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
        this.machinesSubject.next(data);
    }

    // GET: Retorna do cache se existir, ou força busca na API se forceRefresh for true
    public getMachines(forceRefresh = false): Observable<MachineInterface[]> {
        if (this.machinesSubject.value.length > 0 && !forceRefresh) {
            return this.machinesInCache;
        }
        return this.refreshMachinesFromApi();
    }

    // Força busca na API do Google Sheets e atualiza o cache
    public refreshMachinesFromApi(): Observable<MachineInterface[]> {
        return this.http.get<MachineInterface[]>(this.apiUrl).pipe(
            tap((data) => this.setCache(data))
        );
    }

    // POST: Adiciona uma nova máquina e atualiza o cache local
    public addMachine(newMachine: MachineInterface): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });
        const payload = { action: 'create', ...newMachine };

        return this.http.post(this.apiUrl, JSON.stringify(payload), { headers }).pipe(
            tap(() => {
                const currentList = this.machinesSubject.value;
                this.setCache([...currentList, newMachine]);
            })
        );
    }

    // PUT / POST: Atualiza uma máquina existente pelo identificador
    public updateMachine(updatedMachine: MachineInterface): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });
        const payload = { action: 'update', ...updatedMachine };

        return this.http.post(this.apiUrl, JSON.stringify(payload), { headers }).pipe(
            tap(() => {
                const currentList = this.machinesSubject.value;
                const updatedList = currentList.map((m) =>
                    m.Nome_da_Maquina === updatedMachine.Nome_da_Maquina ? updatedMachine : m
                );
                this.setCache(updatedList);
            })
        );
    }

    // DELETE / POST: Remove uma máquina pelo Nome_da_Maquina (ou ID equivalente)
    public deleteMachine(machineName: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });
        const payload = { action: 'delete', Nome_da_Maquina: machineName };

        return this.http.post(this.apiUrl, JSON.stringify(payload), { headers }).pipe(
            tap(() => {
                const currentList = this.machinesSubject.value;
                const filteredList = currentList.filter((m) => m.Nome_da_Maquina !== machineName);
                this.setCache(filteredList);
            })
        );
    }
}

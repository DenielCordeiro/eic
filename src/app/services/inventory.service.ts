import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Machine } from '../models/machine';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  // Substitua com a sua URL do Google Apps Script (a que termina em /exec)
  private apiUrl = 'SUA_URL_DO_GOOGLE_APPS_SCRIPT_AQUI';

  constructor(private http: HttpClient) {}

  // Busca a lista de máquinas cadastradas
  getMachines(): Observable<Machine[]> {
    return this.http.get<Machine[]>(this.apiUrl);
  }

  // Envia uma nova máquina para ser gravada na planilha
  addMachine(newMachine: Machine): Observable<any> {
    // Usamos text/plain para contornar restrições de CORS do Apps Script
    const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });
    return this.http.post(this.apiUrl, JSON.stringify(newMachine), { headers });
  }
}

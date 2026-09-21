import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'machines',
    pathMatch: 'full'
  },
  {
    path: 'machines',
    loadComponent: () =>
      import('./components/machines/machines').then(m => m.Machines)
  },
  {
    path: '**',
    redirectTo: 'machines'
  }
];

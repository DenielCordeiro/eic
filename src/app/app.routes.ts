import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'add-machine',
    pathMatch: 'full'
  },
  {
    path: 'machines',
    loadComponent: () =>
      import('./components/machines/machines').then(m => m.Machines)
  },
  {
    path: 'add-machine',
    loadComponent: () =>
      import('./components/machines/add-machine/add-machine').then(m => m.AddMachine)
  },
  {
    path: '**',
    redirectTo: 'add-machine'
  }
];

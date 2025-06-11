/* eslint-disable @typescript-eslint/typedef */
import { Routes } from '@angular/router';

import { PageNotFoundComponent } from './common/components/page-not-found/page-not-found.component';
import { FORM_EDITOR_URL, FORM_VIEW_URL } from './common/constants';
import { exitSavingGuard } from './common/guards/exit.saving.guard';
import { CoreHomePageComponent } from './core/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: CoreHomePageComponent,
  },
  {
    path: `${FORM_EDITOR_URL}/:id`,
    loadComponent: () => import('./modules/form-editor/home/home.component').then((c) => c.FEHomePageComponent),
    canDeactivate: [exitSavingGuard],
  },
  {
    path: `${FORM_VIEW_URL}/:id`,
    loadComponent: () => import('./modules/form-viewer/home/home.component').then((c) => c.FVHomePageComponent),
    canDeactivate: [exitSavingGuard],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

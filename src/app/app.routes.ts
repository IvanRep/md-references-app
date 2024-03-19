import { Routes } from '@angular/router';
import { ReferencesComponent } from '@/app/pages/references/references.component';
import { MdReferencesComponent } from '@/app/pages/md-references/md-references.component';

export const routes: Routes = [
  {
    path: '',
    component: ReferencesComponent,
  },
  {
    path: 'md',
    component: MdReferencesComponent,
  },
];

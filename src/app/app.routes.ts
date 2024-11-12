import { Routes } from '@angular/router';
import { GlobalConstants } from '@shared/models/global-constants';
import { resolverExtUrl } from '@shared/services/ext-url-resolver.service';
import { authGuard } from '@shared/guards/auth-guard.service';
import { environment } from '../environments/environment';
import { DemoPageComponent } from './modules/dashboard/components/dashboard/demo-page.component';
import {SupplierManagerComponent} from './modules/dashboard/components/supplier-manager/supplier-manager.component';
import { RouterModule } from '@angular/router';
import { SupplierEvaluationComponent } from './modules/dashboard/components/supplier-evaluation/supplier-evaluation.component';

const nombrePagina = GlobalConstants.nombrePagina;
const default_role = environment.default_role

//Para pedir login inmediato se deben activar el resolver y el guard de la ruta
export const routes: Routes = [
  {
    path: `dashboard`,
    //resolve: { url: resolverExtUrl },
    //canActivate: [authGuard],
    component: DemoPageComponent,
    // title: nombrePagina,
    // data: { expectedRoles: [default_role] }    
  },
  { path: 'supplier-manager', component: SupplierManagerComponent },
  {path: 'supplier-evaluation', component: SupplierEvaluationComponent},
  
  

  {
    path: 'unauthorized',
    loadComponent: () => import('./shared/components/unauthorized/unauthorized.component')
  },
  {
    //A esta ruta llega el codigo para generar el token, por lo cual debe coincidir 
    //con la ruta registrada en GZRASCR_REDIRECT_URI. Para este caso es: 'http://localhost:4200/authorize'
    path: 'authorize',
    loadComponent: () => import('./shared/components/redirect/redirect.component')
  },
  {
    path: 'redirect',
    loadComponent: () => import('./shared/components/redirect/redirect.component')
  },
  {
    path: 'waitAuth',
    resolve: {
      url: resolverExtUrl
    },
    data: { expectedRoles: [default_role] },
    canActivate: [authGuard],
    loadComponent: () => import('./shared/components/espera-auth/espera-auth.component')
  },
  { path: '', redirectTo: 'supplier-manager', pathMatch: 'full' },
  { path: '**', redirectTo: `supplier-manager` }
];

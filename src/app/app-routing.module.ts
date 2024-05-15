import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { MainComponent } from './features/main/main.component';
import { AuthForwardGuard } from './core/auth-forward.guard';
import { PolicyComponent } from './features/policy/policy.component';

const routes: Routes = [
  {path: '', component: LayoutComponent,
    children: [
      {path: '', component: MainComponent},
      {path: '', loadChildren: ()=>import('./features/authorization/user.module').then(m=>m.UserModule), canActivate: [AuthForwardGuard]},
      {path: '', loadChildren: ()=>import('./features/blog/blog.module').then(m=> m.BlogModule)},
      {path: 'policy', component: PolicyComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

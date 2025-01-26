import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component'; 
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Rota de login (não protegida)
  { path: 'home', component: AppComponent, canActivate: [AuthGuard] }, // Rota protegida
  { path: '**', redirectTo: 'login' }, // Redireciona qualquer rota inválida para o login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

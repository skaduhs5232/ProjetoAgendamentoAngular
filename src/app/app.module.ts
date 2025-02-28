
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MarcarAgendamentoComponent } from './marcar-agendamento/marcar-agendamento.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginComponent,
    MarcarAgendamentoComponent,
    AppComponent,
  ],
  // bootstrap: [AppComponent]
})
export class AppModule {}
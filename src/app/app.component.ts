import { Component } from '@angular/core';
import { MarcarAgendamentoComponent } from './marcar-agendamento/marcar-agendamento.component';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../app/services/api'
@Component({
  selector: 'app-root',
  imports: [MarcarAgendamentoComponent, RouterOutlet, HttpClientModule],
  providers: [ApiService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'agendamentos';
}

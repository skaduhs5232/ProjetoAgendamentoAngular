import { Component } from '@angular/core';
import { MarcarAgendamentoComponent } from './marcar-agendamento/marcar-agendamento.component';

@Component({
  selector: 'app-root',
  imports: [MarcarAgendamentoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'agendamentos';
}

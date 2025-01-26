import { Component } from '@angular/core';
import { MarcarAgendamentoComponent } from './marcar-agendamento/marcar-agendamento.component';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [MarcarAgendamentoComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'agendamentos';
}

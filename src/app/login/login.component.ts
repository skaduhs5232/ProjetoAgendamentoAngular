import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  email = 'teste@gmail.com';
  password = 'teste';

  constructor(private router: Router) {}

  onLogin() {
    if (this.email === 'teste@gmail.com' && this.password === 'teste') {
      localStorage.setItem('isLoggedIn', 'true');
      this.router.navigate(['/marcar-agendamento']);
    } else {
      alert('Credenciais inválidas');
    }
  }
}

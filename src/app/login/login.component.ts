import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class LoginComponent {
  loginForm: FormGroup; // FormGroup para Login
  signupForm: FormGroup; // FormGroup para Cadastro

  constructor(private fb: FormBuilder, private router: Router, private api: ApiService) {
    // Inicializa o formulário de login
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(4)]],
    });

    // Inicializa o formulário de cadastro
    this.signupForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  
  onLogin() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.api.getPosts(credentials).subscribe({
        next: (data: any) => {
          if (data.success) {
            localStorage.setItem('isLoggedIn', 'true');
            this.router.navigate(['/marcar-agendamento']);
          } else {
            alert('Credenciais inválidas');
          }
        },
        error: (err) => {
          console.error('Erro ao conectar com a API:', err);
          alert('Erro ao tentar fazer login. Tente novamente.');
        },
      });
    } else {
      alert('Por favor, preencha os campos de login corretamente.');
    }
  }

  // Método para cadastro
  onSignup() {
    if (this.signupForm.valid) {
      const newUser = this.signupForm.value;

      this.api.createPost(newUser).subscribe({
        next: () => {
          alert('Cadastro realizado com sucesso!');
          this.signupForm.reset(); // Limpa o formulário
        },
        error: (err) => {
          console.error('Erro ao cadastrar:', err);
          alert('Erro ao tentar cadastrar. Tente novamente.');
        },
      });
    } else {
      alert('Por favor, preencha os campos de cadastro corretamente.');
    }
  }
}
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { API_PSICOLOGOS, MAIN_URL, Psicologo } from '../../interfaces/psicologo';

@Component({
  selector: 'app-marcar-agendamento',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './marcar-agendamento.component.html',
  styleUrls: ['../scss/marcar-agendamento.component.scss', '../scss/form.component.scss','../scss/loader.component.scss']
})
export class MarcarAgendamentoComponent {
  form: FormGroup;
  loading = false;
  mainURL = MAIN_URL;
  scriptURL = '';
  psychologists: Psicologo[] = [];
  loadingPsychologists = false;
  loadingHorarios = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      Nome: ['', Validators.required],
      Psicólogo: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Data: ['', Validators.required],
      Hora: [{ value: '', disabled: true }, Validators.required]
    });
  }

  ngOnInit() {
    this.setMinDate();
    this.loadPsychologists();

    this.form.get('Psicólogo')?.valueChanges.subscribe(value => {
      this.onPsychologistChange(value);
    });

    this.form.get('Data')?.valueChanges.subscribe(value => {
      this.onDateChange(value);
    });
  }

  setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.querySelector('input[type="date"]');
    if (dateInput) {
      dateInput.setAttribute('min', today);
    }
  }

  loadPsychologists() {
    this.loadingPsychologists = true;

    fetch(API_PSICOLOGOS)
      .then(response => response.json())
      .then(data => {
        this.psychologists = data;
        this.loadingPsychologists = false;
      })
      .catch(error => console.error('Error loading psychologists:', error))
      .finally(() => {
      this.loadingPsychologists = false; // Desativa o loader
    });
  }

  capitalizeFirstLetter(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  showFeedback(message: string, type: string) {
    const container = document.getElementById('feedback-container');
    const messageElement = document.getElementById('feedback-message');

    if (container && messageElement) {
      messageElement.className = 'feedback-message ' + type;
      messageElement.textContent = message;
      container.style.display = 'block';
      setTimeout(() => {
        container.style.display = 'none';
      }, 5000);
    }
  }


  converterDataParaISO(data: string): string {
    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  }

  onPsychologistChange(psychologistName: string) {
    const psychologist = this.psychologists.find(p => p.nome === psychologistName);
    if (psychologist) {
      this.scriptURL = psychologist.url;
      const date = this.form.get('Data')?.value;
      if (date) {
        this.form.get('Hora')?.enable();
        this.obterHorarios(this.scriptURL, date);
      }
    }
  }

  onDateChange(date: string) {
    const psychologist = this.form.get('Psicólogo')?.value;
    if (psychologist && date) {
      this.form.get('Hora')?.enable();
      this.obterHorarios(this.scriptURL, date);
    } else {
      this.form.get('Hora')?.disable();
    }
  }

  gerarHorariosDisponiveis(): string[] {
    const horarios: string[] = [];
    for (let h = 8; h <= 18; h++) {
      const horaFormatada = h.toString().padStart(2, '0') + ':00';
      horarios.push(horaFormatada);
    }
    return horarios;
  }

  horariosDisponiveis: string[] = [];

  preencherHorarios(horarios: string[]) {
    const horaControl = this.form.get('Hora');
    if (horaControl) {
      horaControl.setValue('');
      horaControl.enable();
    }

    this.horariosDisponiveis = horarios;
    console.log('Horários para preencher:', this.horariosDisponiveis);
  }

  obterHorarios(scriptURL: string, dataSelecionada: string) {
    this.loadingHorarios = true; 
    this.form.get('Hora')?.setValue('');
    this.form.get('Hora')?.disable();

    fetch(scriptURL)
      .then((response) => response.json())
      .then((data) => {
        console.log('Horários e datas recebidos:', data.horarios);

        const horariosOcupados = data.horarios
          .filter(
            (horario: any) =>
              this.converterDataParaISO(horario.data) === dataSelecionada
          )
          .map((horario: any) => horario.hora);

        console.log('Horários ocupados:', horariosOcupados);

        const horariosDisponiveis = this.gerarHorariosDisponiveis();

        const horariosFiltrados = horariosDisponiveis.filter(
          (hora) => !horariosOcupados.includes(hora)
        );

        console.log('Horários disponíveis:', horariosFiltrados);

        const horaControl = this.form.get('Hora');
        if (horaControl) {
          horaControl.enable();
          horaControl.setValue('');
        }

        this.preencherHorarios(horariosFiltrados);
      })
      .catch((error) => {
        console.error('Erro ao obter os horários:', error);
        this.showFeedback('Erro ao carregar os horários.', 'error');
      }).finally(() => {
        this.loadingHorarios = false; 
      });
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const formData = new FormData();
    Object.keys(this.form.value).forEach(key => {
      let value = this.form.value[key];
      if (key === 'Nome' || key === 'Psicólogo') {
        value = this.capitalizeFirstLetter(value);
      }
      formData.append(key, value);
    });

    this.loading = true;

    try {
      const mainResponse = await fetch(this.mainURL, {
        method: 'POST',
        body: formData,
      });
      const result = await mainResponse.json();

      if (result.result === 'success') {
        this.showFeedback(
          'Obrigado, seu cadastro foi adicionado com sucesso! Fique de olho na data!',
          'success'
        );

        if (this.scriptURL) {
          await fetch(this.scriptURL, { method: 'POST', body: formData });
        }

        this.form.reset();
      } else if (result.result === 'error' && result.message === 'agendamento duplicado') {
        this.showFeedback(
          'Este agendamento já foi feito. Por favor, selecione outro horário.',
          'warning'
        );
      } else {
        this.showFeedback('Erro: ' + result.message, 'error');
      }
    } catch (error) {
      console.error('Error!', error);
      this.showFeedback(
        'Houve um erro ao enviar os dados. Tente novamente mais tarde.',
        'error'
      );
    } finally {
      this.loading = false;
    }
  }
}

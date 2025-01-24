import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader-component',
  imports: [],
  templateUrl: './loader-component.component.html',
  styleUrl: './loader-component.component.scss'
})
export class LoaderComponentComponent {
@Input() isLoading = true;
}

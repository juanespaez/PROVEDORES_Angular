import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-espera-auth',
  standalone: true,
  imports: [MatCardModule, MatProgressBarModule],
  templateUrl: './espera-auth.component.html',
  styleUrl: './espera-auth.component.scss'
})
export default class EsperaAuthComponent {

}

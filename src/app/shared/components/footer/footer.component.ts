import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GlobalConstants } from '@shared/models/global-constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  footer_text: string;

  constructor() {
    this.footer_text = GlobalConstants.footer
  }

}

import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TokenService } from '@shared/services/token.service';
import { environment } from '../../../../environments/environment';

const DEFAULT_ROLE = environment.default_role

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss'
})
export default class UnauthorizedComponent implements OnInit{

  hasDefaultRole: boolean;

  constructor(private tokenService: TokenService) {
    this.hasDefaultRole = false
  }
  ngOnInit(): void {
    this.hasDefaultRole = this.tokenService.getAuthorities().includes(DEFAULT_ROLE)
  }
}

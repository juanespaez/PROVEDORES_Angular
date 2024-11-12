import { AfterViewInit, Component, inject, OnDestroy, OnInit, WritableSignal } from '@angular/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { DemoService } from '../../services/demo.service';
import { RecaptchaCustomModule } from '@shared/ngModules/dashboard/recaptcha-custom.module';
import { RecaptchaService } from '@shared/services/recaptcha.service';
import Swal from 'sweetalert2';
import { TokenService } from '@shared/services/token.service';
import { Theme, ThemeChangerService } from '@shared/services/theme-changer.service';

@Component({
  selector: 'app-demo-page',
  standalone: true,
  imports: [RecaptchaCustomModule],
  templateUrl: './demo-page.component.html',
  styleUrl: './demo-page.component.scss'
})
export class DemoPageComponent implements OnInit, AfterViewInit, OnDestroy {

  private unsubscribe: Subject<void>;
  private themeManager = inject(ThemeChangerService);
  theme: WritableSignal<Theme> = this.themeManager.theme;
  data: string;
  isLogged: boolean;

  constructor(private demoService: DemoService,
    private recaptchaService: RecaptchaService,
    private tokenService: TokenService) {
    this.unsubscribe = new Subject<void>();
    this.data = '';
    this.isLogged = false;
  }
  ngAfterViewInit(): void {
    this.recaptchaService.showRecaptchaBadge();
  }
  ngOnInit(): void {
    //this.sampleMethod();
    this.isLogged = this.tokenService.isLogged();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.recaptchaService.hideRecaptchaBadge();
  }

  sampleMethod() {
    //Ejemplo de envio de token de recaptcha al backend consumiendo servicio demo
    firstValueFrom(this.recaptchaService.validateRecaptcha()).then(
      (response) => {
        return response
      }).then(
        (response) => {
          const parm01: string = '';
          this.demoService.getInfo(parm01, response).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            this.data = data.response
          })
        }
      ).catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'No fue posible validar el CAPTCHA',
          text: 'Contacte con el administrador del sitio'
        });
        throw error
      });
  }
}

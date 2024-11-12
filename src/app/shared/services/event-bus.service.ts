import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

//servicio para comunicar eventos a través de toda la aplicación
@Injectable({
  providedIn: 'root'
})
export class EventBusService implements OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private spinnerState = new BehaviorSubject<boolean>(false);

  constructor() {
    
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  showSpinner() {
    this.spinnerState.next(true);
  }

  hideSpinner() {
    this.spinnerState.next(false);
  }

  getSpinnerState() {
    return this.spinnerState.asObservable();
  }

}

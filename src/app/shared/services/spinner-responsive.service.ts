import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerResponsiveService {
  private _isSmallScreenDevice: boolean = false;
  public isSmallScreenDeviceChange: EventEmitter<boolean> = new EventEmitter();

  constructor() {
    this.checkWindowSize();
    window.addEventListener('resize', () => this.checkWindowSize());
  }

  private checkWindowSize(): void {
    const isSmallScreenDevice = window.innerWidth < 577;
    if (this._isSmallScreenDevice !== isSmallScreenDevice) {
      this._isSmallScreenDevice = isSmallScreenDevice;
      this.isSmallScreenDeviceChange.emit(isSmallScreenDevice);
    }
  }

  get isSmallScreenDevice(): boolean {
    return this._isSmallScreenDevice;
  }
}

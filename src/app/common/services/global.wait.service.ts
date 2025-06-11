import {
  ApplicationRef,
  Component,
  ComponentRef,
  createComponent,
  DOCUMENT,
  HostBinding,
  inject,
  Injectable,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  template: '<mat-spinner></mat-spinner>',
  imports: [MatProgressSpinnerModule],
  styles: `
    :host {
      display: none;
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 1001;
      background-color: rgba(0, 0, 0, 0.2);
      flex-direction: column;
      align-items: center;
      justify-content: center;
      &.visible {
        display: flex;
      }
    }
  `,
})
export class WaitComponent {
  visible = true;

  @HostBinding('class.visible') get visibleClass(): boolean {
    return this.visible;
  }
}

@Injectable({ providedIn: 'root' })
export class GlobalWaitService {
  private readonly document = inject(DOCUMENT);

  private readonly appRef = inject(ApplicationRef);

  private waitRef: ComponentRef<WaitComponent> | null = null;

  showWait(): void {
    if (!this.waitRef) {
      this.waitRef = createComponent(WaitComponent, { environmentInjector: this.appRef.injector });
      this.document.body.appendChild(this.waitRef.location.nativeElement);
      this.appRef.attachView(this.waitRef.hostView);
    } else {
      this.waitRef.instance.visible = true;
    }
  }

  hideWait(): void {
    if (this.waitRef) {
      this.waitRef.instance.visible = false;
    }
  }
}

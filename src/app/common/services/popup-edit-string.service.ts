import {
  AfterViewInit,
  ApplicationRef,
  Component,
  createComponent,
  DOCUMENT,
  inject,
  Injectable,
  ViewChild,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { JSTFormControl, JSTInputComponent, JSTInputModule } from '@jst/ui';
import { Observable, Subscriber } from 'rxjs';

import { ValidatorHelper } from '../helpers/validator.helper';

@Component({
  template: `
    <div class="popup-container">
      <div class="popup-title-container">
        <div class="popup-title">{{ title }}</div>
        <button matIconButton color="accent" (click)="onClose()">
          <mat-icon>highlight_off</mat-icon>
        </button>
      </div>
      <div class="popup-content">
        <jst-input #inputRef [label]="label" [formControl]="control"></jst-input>
      </div>
      <div class="popup-buttons">
        <button matButton="filled" color="primary" [disabled]="!control.valid" (click)="onApply()">Применить</button>
        <button class="ml-10" matButton="filled" color="accent" (click)="onClose()">Отмена</button>
      </div>
    </div>
  `,
  imports: [MatButtonModule, MatIconModule, JSTInputModule],
  styles: `
    @use 'colors';
    :host {
      display: flex;
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
    }
    :host ::ng-deep {
      .mat-mdc-form-field-subscript-wrapper,
      .mat-mdc-form-field-bottom-align {
        display: none;
      }
    }
    .popup-container {
      display: flex;
      flex-direction: column;
      box-shadow: -2px 2px 5px rgba(0, 0, 0, 0.2);
      background-color: colors.$white;
      border-radius: 6px;
      width: 360px;
    }
    .popup-title-container {
      display: flex;
      align-items: center;
      padding: 0 5px 0 10px;
      border-bottom: 1px solid colors.$blue;
    }
    .popup-title {
      flex: auto;
      line-height: 36px;
    }
    .popup-content {
      padding: 20px 10px;
    }
    .popup-buttons {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 10px;
      border-top: 1px solid colors.$blue;
    }
  `,
})
export class PopupEditStringComponent implements AfterViewInit {
  title = '';

  label = '';

  readonly control = new JSTFormControl(null, [Validators.required, ValidatorHelper.notEmptyValue]);

  onClose: () => void = () => {};

  onApply: () => void = () => {};

  @ViewChild(JSTInputComponent, { static: false }) inputRef!: JSTInputComponent;

  ngAfterViewInit(): void {
    if (this.inputRef) {
      this.inputRef.focus();
    }
  }
}

@Injectable({ providedIn: 'root' })
export class PopupEditStringService {
  private readonly document = inject(DOCUMENT);

  private readonly appRef = inject(ApplicationRef);

  showPopup(title: string, label: string, value?: string): Observable<string | undefined> {
    return new Observable<string | undefined>((observer: Subscriber<string | undefined>) => {
      const popupRef = createComponent(PopupEditStringComponent, { environmentInjector: this.appRef.injector });
      this.document.body.appendChild(popupRef.location.nativeElement);
      this.appRef.attachView(popupRef.hostView);
      popupRef.instance.title = title;
      popupRef.instance.label = label;
      popupRef.instance.control.setValue(value ?? null);
      popupRef.instance.onClose = () => {
        this.appRef.detachView(popupRef.hostView);
        popupRef.destroy();
        observer.next(undefined);
        observer.complete();
      };
      popupRef.instance.onApply = () => {
        if (popupRef.instance.control.valid) {
          this.appRef.detachView(popupRef.hostView);
          popupRef.destroy();
          observer.next(popupRef.instance.control.value);
          observer.complete();
        }
      };
    });
  }
}

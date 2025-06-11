import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';

export interface IAddElementEvent {
  position: string;
  typeElement: string;
}

@Component({
  selector: 'menu-add-element',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  template: `
    <mat-menu #menuAddElements="matMenu">
      <ng-template matMenuContent let-position="position">
        <button mat-menu-item (click)="onAddElement(position, 'tabs')">Вкладки</button>
        <button mat-menu-item (click)="onAddElement(position, 'panel')">Панель</button>
        <button mat-menu-item [matMenuTriggerFor]="menuAddControls" [matMenuTriggerData]="{ position }">Контрол</button>
      </ng-template>
    </mat-menu>

    <mat-menu #menuAddControls="matMenu">
      <ng-template matMenuContent let-position="position">
        <button mat-menu-item (click)="onAddElement(position, 'text')">Строка</button>
        <button mat-menu-item (click)="onAddElement(position, 'list')">Список</button>
        <button mat-menu-item (click)="onAddElement(position, 'number')">Число</button>
        <button mat-menu-item (click)="onAddElement(position, 'datetime')">Дата/время</button>
        <button mat-menu-item (click)="onAddElement(position, 'checkbox')">Флажок</button>
      </ng-template>
    </mat-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EMenuAddElementComponent {
  @ViewChild('menuAddElements', { static: true }) menu!: MatMenu;

  @Output() addElementEvent = new EventEmitter<IAddElementEvent>();

  onAddElement(position: string, typeElement: string): void {
    this.addElementEvent.emit({ position, typeElement });
  }
}

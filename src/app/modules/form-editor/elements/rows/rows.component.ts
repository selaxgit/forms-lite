import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';

import { FLCreateElementType, IFLRow } from '../../../../common/interfaces';
import { CurrentFormStore } from '../../../../stores/current-form.store';

@Component({
  selector: 'form-rows',
  templateUrl: './rows.component.html',
  styleUrl: './rows.component.scss',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ERowsComponent {
  @Input() rows: IFLRow[] = [];

  @Input() parentGuid: string | null = null;

  private readonly currentFormStore = inject(CurrentFormStore);

  onAddElement(typeElement: FLCreateElementType): void {
    this.currentFormStore.addRowWithElement(this.parentGuid, typeElement);
  }
}

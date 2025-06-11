import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, inject, Input } from '@angular/core';

import { FLCreateElementType, IFLElement, VerticalAlignEnum } from '../../../../common/interfaces';
import { CurrentFormStore } from '../../../../stores/current-form.store';
import { IDragExtendedComponent } from '../directives/interfaces';

@Component({
  selector: 'form-row',
  templateUrl: './row.component.html',
  styleUrl: './row.component.scss',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ERowComponent implements IDragExtendedComponent {
  @Input() guid = 'unknown';

  @Input() idx: number = 0;

  @Input() parentGuid: string | null = null;

  @Input() children!: IFLElement[];

  @Input() verticalAlign: VerticalAlignEnum = VerticalAlignEnum.Middle;

  readonly hostComponent = this;

  readonly verticalAlignEnum = VerticalAlignEnum;

  readonly elementRef = inject(ElementRef);

  private readonly currentFormStore = inject(CurrentFormStore);

  @HostBinding('style.align-items') get align(): string {
    switch (this.verticalAlign) {
      case VerticalAlignEnum.Top:
        return 'flex-start';
      case VerticalAlignEnum.Bottom:
        return 'flex-end';
      default:
        return 'center';
    }
  }

  onSetVerticalAlign(value: VerticalAlignEnum): void {
    this.currentFormStore.setRowVerticalAlign(this.guid, value);
  }

  onRemoveRow(): void {
    this.currentFormStore.removeRow(this.parentGuid, this.guid);
  }

  onAddRow(position: string | null, typeElement: FLCreateElementType): void {
    const idx = position == 'AFTER' ? this.idx + 1 : this.idx;
    this.currentFormStore.addRowWithElement(this.parentGuid, typeElement, idx);
  }
}

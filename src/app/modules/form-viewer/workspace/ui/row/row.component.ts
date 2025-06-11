import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

import { IFLRow, VerticalAlignEnum } from '../../../../../common/interfaces';

@Component({
  selector: 'ui-row',
  templateUrl: './row.component.html',
  styleUrl: './row.component.scss',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIRowComponent {
  @Input() row!: IFLRow;

  @HostBinding('style.align-items') get align(): string {
    switch (this.row.verticalAlign) {
      case VerticalAlignEnum.Top:
        return 'flex-start';
      case VerticalAlignEnum.Bottom:
        return 'flex-end';
      default:
        return 'center';
    }
  }
}

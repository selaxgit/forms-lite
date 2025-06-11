import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IFLRow } from '../../../../../common/interfaces';

@Component({
  selector: 'ui-rows',
  templateUrl: './rows.component.html',
  styleUrl: './rows.component.scss',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIRowsComponent {
  @Input() rows: IFLRow[] = [];
}

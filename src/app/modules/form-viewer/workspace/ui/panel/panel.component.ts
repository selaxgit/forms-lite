import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IFLElement } from '../../../../../common/interfaces';

@Component({
  selector: 'ui-panel',
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIPanelComponent {
  @Input() element!: IFLElement;
}

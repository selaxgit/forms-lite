import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IFLElement } from '../../../../../common/interfaces';

@Component({
  selector: 'ui-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UITabsComponent {
  @Input() element!: IFLElement;
}

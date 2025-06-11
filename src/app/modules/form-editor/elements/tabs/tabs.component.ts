import { ChangeDetectionStrategy, Component, ElementRef, inject, Input } from '@angular/core';

import { IFLElement, IFLRow } from '../../../../common/interfaces';
import { IDragExtendedComponent } from '../directives/interfaces';

@Component({
  selector: 'form-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ETabsComponent implements IDragExtendedComponent {
  @Input() guid = 'unknown';

  @Input() children: (IFLElement | IFLRow)[] = [];

  readonly elementRef = inject(ElementRef);
}

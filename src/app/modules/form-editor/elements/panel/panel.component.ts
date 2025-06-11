import { ChangeDetectionStrategy, Component, ElementRef, inject, Input } from '@angular/core';

import { IFLElement, IFLRow } from '../../../../common/interfaces';
import { IDragExtendedComponent } from '../directives/interfaces';

@Component({
  selector: 'form-panel',
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EPanelComponent implements IDragExtendedComponent {
  @Input() guid = 'unknown';

  @Input() label = 'unknown';

  @Input() children: (IFLElement | IFLRow)[] = [];

  readonly elementRef = inject(ElementRef);
}

import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, inject, Input } from '@angular/core';

import { FLControlTypeEnum, IFLElement } from '../../../../common/interfaces';
import { IDragExtendedComponent } from '../directives/interfaces';

@Component({
  selector: 'form-control',
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EControlComponent implements IDragExtendedComponent {
  @Input() idx: number = 0;

  @Input() rowGuid = 'unknown';

  @Input() guid = 'unknown';

  @Input() element!: IFLElement;

  @Input() type: FLControlTypeEnum | null = null;

  @Input() label: string = '';

  @Input() clearButton: boolean = false;

  @HostBinding('class.without-border') get isWithoutBorder(): boolean {
    return this.type === FLControlTypeEnum.Checkbox;
  }

  readonly controlTypeEnum = FLControlTypeEnum;

  readonly elementRef = inject(ElementRef);
}

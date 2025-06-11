import { ChangeDetectionStrategy, Component, HostBinding, inject, Input } from '@angular/core';

import { FLElementTypeEnum, IFLElement, WidthUnitEnum } from '../../../../../common/interfaces';
import { ControlElement } from '../../services/control-element.class';
import { WorkspaceService } from '../../services/workspace.service';

@Component({
  selector: 'ui-element',
  templateUrl: './element.component.html',
  styleUrl: './element.component.scss',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIElementComponent {
  @Input() set element(value: IFLElement) {
    this.elementInfo = value;
    this.controlElement = this.workspaceService.getElement(value.guid);
  }

  elementInfo!: IFLElement;

  readonly elementTypeEnum = FLElementTypeEnum;

  private readonly workspaceService = inject(WorkspaceService);

  private controlElement: ControlElement | null = null;

  @HostBinding('class.flex-auto') get flexAuto(): boolean {
    return this.elementInfo.autofill;
  }

  @HostBinding('class.display-none') get displyNone(): boolean {
    return !(this.controlElement?.visibleElement ?? true);
  }

  @HostBinding('style.width') get getWidth(): string {
    if (this.elementInfo.width && this.elementInfo.widthUnit) {
      switch (this.elementInfo.widthUnit) {
        case WidthUnitEnum.Percents:
          return `${this.elementInfo.width}%`;
        case WidthUnitEnum.Pixels:
          return `${this.elementInfo.width}px`;
      }
    }
    return 'auto';
  }
}

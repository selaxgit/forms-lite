import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';

import { FLControlSubTypeEnum, FLControlTypeEnum, IFLElement } from '../../../../../common/interfaces';
import { ControlElement } from '../../services/control-element.class';
import { WorkspaceService } from '../../services/workspace.service';

@Component({
  selector: 'ui-control',
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIControlComponent {
  @Input() set element(value: IFLElement) {
    this.elementInfo = value;
    this.controlElement = this.workspaceService.getElement(value.guid);
  }

  elementInfo!: IFLElement;

  controlElement: ControlElement | null = null;

  readonly controlTypeEnum = FLControlTypeEnum;

  readonly controlSubTypeEnum = FLControlSubTypeEnum;

  private readonly workspaceService = inject(WorkspaceService);
}

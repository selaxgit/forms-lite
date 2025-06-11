import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IJSTSelectItem, JSTInputModule, JSTSelectModule } from '@jst/ui';

import { IFLRequest, UFMethodHttpEnum } from '../../../interfaces';

@Component({
  selector: 'params-http-request',
  imports: [JSTInputModule, JSTSelectModule],
  templateUrl: './params-http-request.component.html',
  styleUrl: './params-http-request.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParamsHttpRequestComponent {
  @Input() request!: IFLRequest;

  @Input() disabledState = false;

  readonly methodHttpList: IJSTSelectItem[] = [
    {
      value: UFMethodHttpEnum.Get,
      title: UFMethodHttpEnum.Get,
    },
    {
      value: UFMethodHttpEnum.Post,
      title: UFMethodHttpEnum.Post,
    },
  ];
}

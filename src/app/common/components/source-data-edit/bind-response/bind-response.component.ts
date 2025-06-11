import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { JSTInputModule } from '@jst/ui';

import { IFLBindResponse } from '../../../interfaces';

@Component({
  selector: 'bind-response',
  imports: [JSTInputModule],
  templateUrl: './bind-response.component.html',
  styleUrl: './bind-response.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BindResponseComponent {
  @Input() bindResponse!: IFLBindResponse;

  @Input() disabledState = false;
}

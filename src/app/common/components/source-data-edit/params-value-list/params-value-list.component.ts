import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { JSTInputModule } from '@jst/ui';

import { IFLParam } from '../../../interfaces';
import { ParamValueItemComponent } from './param-value-iem/param-value-item.component';

@Component({
  selector: 'params-value-list',
  imports: [MatButtonModule, MatIconModule, JSTInputModule, ParamValueItemComponent],
  templateUrl: './params-value-list.component.html',
  styleUrl: './params-value-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParamsValueListComponent {
  @Input() params: IFLParam[] = [];

  @Input() titleAddButton = 'Добавить параметр';

  @Input() titleList = 'Список параметров';

  @Input() titleParam = 'Параметр';

  @Input() titleValue = 'Значение';

  @Input() disabledState = false;

  onRemoveItem(idx: number): void {
    this.params.splice(idx, 1);
  }

  onAddParam(): void {
    this.params.push({
      title: '',
      value: '',
    });
  }
}

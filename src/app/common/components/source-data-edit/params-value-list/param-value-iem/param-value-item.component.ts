import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { JSTInputModule } from '@jst/ui';

@Component({
  selector: 'param-value-item',
  imports: [MatButtonModule, MatIconModule, JSTInputModule],
  templateUrl: './param-value-item.component.html',
  styleUrl: './param-value-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParamValueItemComponent {
  @Input() paramName = '';

  @Input() paramValue = '';

  @Input() titleParam = 'Параметр';

  @Input() titleValue = 'Значение';

  @Input() disabledState = false;

  @Output() paramNameChange = new EventEmitter<string>();

  @Output() paramValueChange = new EventEmitter<string>();

  @Output() removeEvent = new EventEmitter<void>();

  get paramNameValue(): string {
    return this.paramName;
  }

  set paramNameValue(value: string) {
    this.paramNameChange.emit(value);
  }

  get paramValueValue(): string {
    return this.paramValue;
  }

  set paramValueValue(value: string) {
    this.paramValueChange.emit(value);
  }

  onRemove(): void {
    this.removeEvent.emit();
  }
}

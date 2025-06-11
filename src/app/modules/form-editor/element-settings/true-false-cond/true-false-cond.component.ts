import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { JSTInputComponent, JSTInputModule } from '@jst/ui';

type StateType = boolean | 'cond';

@Component({
  selector: 'true-false-cond',
  imports: [MatButtonToggleModule, JSTInputModule, ReactiveFormsModule],
  templateUrl: './true-false-cond.component.html',
  styleUrl: './true-false-cond.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FETrueFalseCondComponent implements OnChanges, AfterViewInit {
  @Input() label = 'Настройка';

  @Input() trueTitle = 'Включено';

  @Input() falseTitle = 'Выключено';

  @Input() condTitle = 'По условию';

  @Input() value: boolean | string | null = null;

  @Output() valueChange = new EventEmitter<boolean | string | null>();

  @ViewChild('inputCond') inputCond!: JSTInputComponent;

  readonly state: WritableSignal<StateType> = signal(false);

  readonly cond: WritableSignal<string | null> = signal(null);

  private holdEvents = true;

  //private stateValue: StateType = false;

  // private condValue: string | null = null;

  onSetState(value?: StateType): void {
    if (value === undefined || this.holdEvents) {
      return;
    }
    this.state.set(value);
    if (typeof value === 'boolean') {
      this.cond.set(null);
      this.valueChange.emit(value);
    } else {
      this.valueChange.emit('');
      this.inputCond?.focus();
    }
  }

  onCondChange(value: string): void {
    if (!this.holdEvents) {
      this.cond.set(value);
      if (this.state() === 'cond') {
        this.valueChange.emit(value);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('value')) {
      if (typeof this.value === 'boolean') {
        this.state.set(this.value);
        this.cond.set(null);
      } else {
        this.state.set('cond');
        this.cond.set(this.value);
      }
    }
  }

  ngAfterViewInit(): void {
    this.holdEvents = false;
  }
}

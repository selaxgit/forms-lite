/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  forwardRef,
  Host,
  inject,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  signal,
  SimpleChanges,
  SkipSelf,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { JSTHelper } from '@jst/ui';

import { HtmlHelper } from '../../helpers/html.helper';

@Component({
  selector: 'autosize-flat-input',
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './autosize-flat-input.component.html',
  styleUrl: './autosize-flat-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutosizeFlatInputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutosizeFlatInputComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() formControlName!: string;

  @Input() formControl!: FormControl<string | null>;

  @Input() value: any = null;

  @Output() valueChange = new EventEmitter<any>();

  @ViewChild('nameInput') nameInput!: ElementRef<HTMLInputElement>;

  control!: FormControl;

  visibleIconNameEdit: WritableSignal<boolean> = signal(false);

  private onChange: any = () => {};

  private onTouched: any = () => {};

  private destroyRef$ = inject(DestroyRef);

  private initialValue: string | number | null = null;

  constructor(
    @Optional()
    @Host()
    @SkipSelf()
    protected readonly controlContainer: ControlContainer,
  ) {}

  ngOnInit(): void {
    if (this.formControl) {
      this.control = this.formControl;
    } else if (this.controlContainer && this.formControlName) {
      this.control = (this.controlContainer.control?.get(this.formControlName) as FormControl) ?? new FormControl(null);
    } else {
      this.control = JSTHelper.hasValue(this.value) ? new FormControl(this.value) : new FormControl(null);
    }
    this.initialValue = this.control.value;
    this.control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe((value: string | null) => {
      this.valueChange.emit(value);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('value')) {
      this.control?.setValue(changes['value'].currentValue);
    }
    if (changes.hasOwnProperty('formControl') && this.formControl) {
      this.control = this.formControl;
    }
  }

  writeValue(val: any): void {
    if (!this.formControl && !this.formControlName) {
      setTimeout(() => this.control.setValue(val));
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInputBlur(byEscape: boolean = false): void {
    if (byEscape || !JSTHelper.hasValue(this.control.value)) {
      this.control.setValue(this.initialValue);
    }
    this.visibleIconNameEdit.set(false);
    HtmlHelper.blurActiveElement();
  }

  onInputFocus(): void {
    this.initialValue = this.control.value;
    this.visibleIconNameEdit.set(true);
    if (this.nameInput.nativeElement) {
      this.nameInput.nativeElement.select();
    }
  }
}

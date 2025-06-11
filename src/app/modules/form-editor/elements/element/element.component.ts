import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  HostBinding,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  FLControlSubTypeEnum,
  FLControlTypeEnum,
  FLCreateElementType,
  FLElementTypeEnum,
  IFLElement,
  IFLRow,
  WidthUnitEnum,
} from '../../../../common/interfaces';
import { CurrentFormStore, ElementCommandType } from '../../../../stores/current-form.store';
import { ElementsHelper } from '../../helpers/elements.helper';

const MAX_TITLE_LABEL = 35;

@Component({
  selector: 'form-element',
  templateUrl: './element.component.html',
  styleUrl: './element.component.scss',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EElementComponent implements OnInit {
  @Input() guid = 'unknown';

  @Input() rowGuid = 'unknown';

  @Input() idx: number = 0;

  @Input() element!: IFLElement;

  @Input() type: FLElementTypeEnum | null = null;

  @Input() autofill = false;

  @Input() controlType: FLControlTypeEnum | null = null;

  @Input() label: string = '';

  @Input() clearButton: boolean = false;

  @Input() children?: (IFLElement | IFLRow)[] = [];

  readonly elementTypeEnum = FLElementTypeEnum;

  readonly controlTypeEnum = FLControlTypeEnum;

  private readonly currentFormStore = inject(CurrentFormStore);

  private readonly cdr = inject(ChangeDetectorRef);

  private readonly destroyRef$ = inject(DestroyRef);

  @HostBinding('class.autofill') get isAutofill(): boolean {
    return this.autofill;
  }

  @HostBinding('class.not-visible') get isNotVisible(): boolean {
    return this.element.visible === false;
  }

  @HostBinding('class.disabled') get isDisabled(): boolean {
    return this.element.disabled === true;
  }

  @HostBinding('style.min-width') get getMinWidth(): string {
    if (this.element.width && this.element.widthUnit) {
      return 'auto';
    }
    return '300px';
  }

  @HostBinding('style.width') get getWidth(): string {
    if (this.element.width && this.element.widthUnit) {
      switch (this.element.widthUnit) {
        case WidthUnitEnum.Percents:
          return `${this.element.width}%`;
        case WidthUnitEnum.Pixels:
          return `${this.element.width}px`;
      }
    }
    return 'auto';
  }

  @HostBinding('class.as-textarea') get asTextarea(): boolean {
    if (this.element.controlProperties?.controlSubType === FLControlSubTypeEnum.Textarea) {
      return true;
    }
    return false;
  }

  ngOnInit(): void {
    this.currentFormStore.currentFormChanged$.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  onShowSettings(): void {
    this.currentFormStore.fireElementSettings(JSON.parse(JSON.stringify(this.element)));
  }

  onRunCommand(command: ElementCommandType): void {
    this.currentFormStore.runElementCommand(this.guid, command);
  }

  onRemoveElement(): void {
    this.currentFormStore.removeElement(this.rowGuid, this.guid);
  }

  onAddElement(position: string | null, typeElement: FLCreateElementType): void {
    const idx = position == 'RIGHT' ? this.idx + 1 : this.idx;
    this.currentFormStore.addElementToRow(this.rowGuid, typeElement, idx);
  }

  getTitleMenuByElement(): string {
    switch (this.element.type) {
      case FLElementTypeEnum.Tabs:
        return 'Вкладки';
      case FLElementTypeEnum.Panel:
        return this.element.label ? `Панель: ${this.element.label}` : 'Панель';
      case FLElementTypeEnum.Control:
        const type = ElementsHelper.typeControlToString(this.element.controlType);
        const label =
          this.element.label.length > MAX_TITLE_LABEL
            ? this.element.label.slice(0, MAX_TITLE_LABEL) + '...'
            : this.element.label;
        return this.element.label ? `Контрол (${type}): ${label}` : `Контрол (${type})`;
      default:
        return '';
    }
  }
}

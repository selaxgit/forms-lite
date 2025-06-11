import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Validators } from '@angular/forms';
import { JSTFormControl, JSTInputModule } from '@jst/ui';
import JSONEditor from 'jsoneditor';

import { PanelContainerComponent } from '../../../common/components/panel-container/panel-container.component';
import { SlidePanelExtendClass } from '../../../common/components/slide-panel';
import { ValidatorHelper } from '../../../common/helpers/validator.helper';
import { IUFDto } from '../../../common/interfaces';

@Component({
  selector: 'dto-edit',
  imports: [PanelContainerComponent, JSTInputModule],
  templateUrl: './dto-edit.component.html',
  styleUrl: './dto-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtoEditComponent extends SlidePanelExtendClass implements OnInit, AfterViewInit, OnDestroy {
  @Input() dto!: IUFDto;

  @ViewChild('jsonElement') jsonElementRef!: ElementRef<HTMLInputElement>;

  title = 'DTO';

  readonly controlName = new JSTFormControl('', [Validators.required, ValidatorHelper.notEmptyValue]);

  private readonly destroyRef = inject(DestroyRef);

  private jsonEditor: JSONEditor | null = null;

  ngOnInit(): void {
    this.title = this.dto.id ? 'Редактирование DTO' : 'Новое DTO';
    this.controlName.setValue(this.dto.name);
    this.controlName.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: string) => (this.dto.name = value.trim()));
  }

  ngAfterViewInit(): void {
    if (this.jsonElementRef?.nativeElement) {
      this.jsonEditor = new JSONEditor(
        this.jsonElementRef.nativeElement,
        {
          mode: 'text',
          mainMenuBar: true,
          history: true,
          enableSort: false,
          enableTransform: false,
          language: 'ru',
        },
        this.dto.source,
      );
    }
  }

  ngOnDestroy(): void {
    if (this.jsonEditor) {
      this.jsonEditor.destroy();
    }
  }

  onApply(): void {
    if (this.jsonEditor && this.controlName.valid) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.jsonEditor.validate().then((errors: any) => {
        if (errors.length === 0) {
          this.dto.source = this.jsonEditor?.get() ?? {};
          this.closePanel(this.dto);
        }
      });
    }
  }

  onClosePanel(): void {
    this.closePanel(null);
  }
}

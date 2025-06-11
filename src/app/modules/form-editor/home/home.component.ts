import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { JSTFileHelper } from '@jst/ui';

import { AutosizeFlatInputComponent } from '../../../common/components/autosize-flat-input/autosize-flat-input.component';
import { CommonHeaderComponent } from '../../../common/components/header/header.component';
import { PageNotFoundComponent } from '../../../common/components/page-not-found/page-not-found.component';
import { SlidePanelService } from '../../../common/components/slide-panel';
import { APP_TITLE, FORM_EDITOR_URL, FORM_NEW, FORM_VIEW_URL } from '../../../common/constants';
import { IFLElement, IForm } from '../../../common/interfaces';
import { CurrentFormStore } from '../../../stores/current-form.store';
import { FESettingsComponent } from '../element-settings/element-settings.component';
import { ElementsModule } from '../elements/elements.module';

@Component({
  selector: 'fe-home-page',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CommonHeaderComponent,
    AutosizeFlatInputComponent,
    PageNotFoundComponent,
    ElementsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FEHomePageComponent implements OnInit {
  readonly currentFormStore = inject(CurrentFormStore);

  private readonly destroyRef$ = inject(DestroyRef);

  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly titleService = inject(Title);

  private readonly router = inject(Router);

  readonly slidePanelService = inject(SlidePanelService);

  ngOnInit(): void {
    this.titleService.setTitle(APP_TITLE);

    this.currentFormStore.currentFormName$
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((name: string | null) => {
        this.titleService.setTitle(`${name} | ${APP_TITLE}`);
      });
    this.currentFormStore.doElementSettings$
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((element: IFLElement) => {
        this.editElement(element);
      });
    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe((params: ParamMap) => {
      this.currentFormStore.loadForm(params.get('id'));
    });
  }

  onDownloadForm(): void {
    const json = JSON.parse(JSON.stringify(this.currentFormStore.currentForm));
    delete json.id;
    JSTFileHelper.downloadJson(json, `${json.name}.json`);
  }

  onViewForm(): void {
    this.router.navigate([FORM_VIEW_URL, this.currentFormStore.currentFormId ?? FORM_NEW]);
  }

  onSaveForm(): void {
    this.currentFormStore
      .saveForm()
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((form: IForm) => {
        this.router.navigate([FORM_EDITOR_URL, form.id]);
      });
  }

  private editElement(element: IFLElement): void {
    this.slidePanelService
      .showPanel$<FESettingsComponent, IFLElement>(
        FESettingsComponent,
        {
          element,
        },
        { disabledClose: true },
      )
      .subscribe((value: IFLElement | null) => {
        if (value) {
          this.currentFormStore.updateElementSettings(value);
        }
      });
  }
}

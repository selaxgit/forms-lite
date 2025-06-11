import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenav } from '@angular/material/sidenav';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { JSTDialogService, JSTFileHelper } from '@jst/ui';

import { CommonHeaderComponent } from '../../../common/components/header/header.component';
import { PageNotFoundComponent } from '../../../common/components/page-not-found/page-not-found.component';
import { APP_TITLE, FORM_EDITOR_URL, FORM_NEW, FORM_VIEW_URL } from '../../../common/constants';
import { IForm, IUFDto } from '../../../common/interfaces';
import { CurrentFormStore } from '../../../stores/current-form.store';
import { DtoStore } from '../../../stores/dto.store';
import { PopupDtoComponent } from '../popup-dto/popup-dto.component';
import { FVWorkspaceComponent } from '../workspace/workspace.component';

@Component({
  selector: 'fv-home-page',
  imports: [
    AsyncPipe,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    CommonHeaderComponent,
    PageNotFoundComponent,
    FVWorkspaceComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FVHomePageComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  readonly currentFormStore = inject(CurrentFormStore);

  readonly dtoStore = inject(DtoStore);

  readonly currentDto: WritableSignal<IUFDto | null> = signal(null);

  private readonly destroyRef$ = inject(DestroyRef);

  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly titleService = inject(Title);

  private readonly router = inject(Router);

  private readonly jstDialogService = inject(JSTDialogService);

  ngOnInit(): void {
    this.titleService.setTitle(APP_TITLE);

    this.currentFormStore.currentFormName$
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((name: string | null) => {
        this.titleService.setTitle(`${name} | ${APP_TITLE}`);
      });
    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe((params: ParamMap) => {
      this.currentFormStore.loadForm(params.get('id'), true);
    });
  }

  showCurrentDto(): void {
    if (this.currentDto()) {
      this.jstDialogService
        .showModal('Просмотр DTO', PopupDtoComponent, { json: this.currentDto()?.source })
        .subscribe();
    }
  }

  onSetDto(dto: IUFDto): void {
    this.currentDto.set(dto);
  }

  onEditForm(): void {
    this.router.navigate([FORM_EDITOR_URL, this.currentFormStore.currentFormId ?? FORM_NEW]);
  }

  onDownloadForm(): void {
    const json = JSON.parse(JSON.stringify(this.currentFormStore.currentForm));
    delete json.id;
    JSTFileHelper.downloadJson(json, `${json.name}.json`);
  }

  onSaveForm(): void {
    this.currentFormStore
      .saveForm()
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((form: IForm) => {
        this.router.navigate([FORM_VIEW_URL, form.id]);
      });
  }

  onCloseDrawer(): void {
    this.sidenav.close();
  }
}

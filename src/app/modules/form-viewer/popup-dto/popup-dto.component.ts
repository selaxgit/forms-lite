/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import JSONEditor from 'jsoneditor';

@Component({
  imports: [MatButtonModule],
  templateUrl: './popup-dto.component.html',
  styleUrl: './popup-dto.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupDtoComponent implements AfterViewInit, OnDestroy {
  dialogRef!: MatDialogRef<PopupDtoComponent>;

  private json: any = {};

  private jsonEditor: JSONEditor | null = null;

  @ViewChild('jsonElement') jsonElementRef!: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    if (this.jsonElementRef?.nativeElement) {
      this.jsonEditor = new JSONEditor(
        this.jsonElementRef.nativeElement,
        {
          mode: 'preview',
          mainMenuBar: false,
          history: true,
          enableSort: false,
          enableTransform: false,
          language: 'ru',
        },
        this.json,
      );
    }
  }

  ngOnDestroy(): void {
    if (this.jsonEditor) {
      this.jsonEditor.destroy();
    }
  }

  setData(data: any): void {
    this.json = data?.json ?? {};
  }

  onClose(): void {
    this.dialogRef.close(null);
  }
}

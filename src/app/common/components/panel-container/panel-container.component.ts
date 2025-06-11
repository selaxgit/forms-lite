import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'panel-container',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './panel-container.component.html',
  styleUrl: './panel-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelContainerComponent {
  @Input() title = 'Панель';

  @Input() applyButtonTitle = 'Применить';

  @Input() cancelButtonTitle = 'Отмена';

  @Input() closeByEscape = false;

  @Output() closeEvent = new EventEmitter<void>();

  @Output() applyEvent = new EventEmitter<void>();

  @HostListener('document:keyup.escape') doKeyEscape(): void {
    if (this.closeByEscape) {
      this.onClosePanel();
    }
  }

  onClosePanel(): void {
    this.closeEvent.emit();
  }

  onApplyPanel(): void {
    this.applyEvent.emit();
  }
}

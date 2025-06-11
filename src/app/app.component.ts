import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import * as pkg from '../../package.json';
import { APP_TITLE } from './common/constants';

@Component({
  imports: [CommonModule, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
})
export class AppComponent {
  version = '???';

  appName = APP_TITLE;

  constructor() {
    this.version = pkg.version;
  }
}

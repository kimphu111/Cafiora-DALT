import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterModule, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [
    RouterLink,RouterModule
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  activeSection: string | null = null;

  toggleSection(section: string) {
    this.activeSection = this.activeSection === section ? null : section;
  }
}

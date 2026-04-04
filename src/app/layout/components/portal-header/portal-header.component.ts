import { Component, Input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

// See ANGULAR-19-STANDARDS.md — Standalone First (no CommonModule)
@Component({
  selector: 'app-portal-header',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './portal-header.component.html',
  styleUrl: './portal-header.component.css'
})
export class PortalHeaderComponent {
  @Input() searchActive = false;
  readonly searchToggle = output<boolean>();

  searchQuery = '';

  onSearchIconClick(): void {
    this.searchToggle.emit(true);
  }

  onSearchClose(): void {
    this.searchQuery = '';
    this.searchToggle.emit(false);
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.onSearchClose();
    }
  }
}

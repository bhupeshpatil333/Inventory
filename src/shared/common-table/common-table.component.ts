import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface ColumnConfig {
  key: string;
  header: string;
  type: 'text' | 'date' | 'status' | 'actions';
  sortable?: boolean;
  statusOptions?: { value: string; label: string; }[];
  actions?: ('edit' | 'delete' | 'view')[];
}

@Component({
  selector: 'app-common-table',
  templateUrl: './common-table.component.html',
  styleUrl: './common-table.component.scss',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatSelectModule, MatIconModule, MatProgressSpinnerModule]
})
export class CommonTableComponent {
  @Input() columns: ColumnConfig[] = [];
  @Input() data: any[] = [];
  @Input() loading = false;

  @Output() edit = new EventEmitter<any>();

  getFormattedValue(value: any): any {
    if (value && typeof value === 'object' && 'toDate' in value) {
      return value.toDate();
    }
    return value;
  }
  @Output() delete = new EventEmitter<any>();
  @Output() view = new EventEmitter<any>();
  @Output() statusChange = new EventEmitter<{ row: any, status: string }>();

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' | '' = '';

  get displayedColumns(): string[] {
    return this.columns.map(col => col.key);
  }

  getSortDirection(column: string): string {
    return this.sortColumn === column ? this.sortDirection : '';
  }

  sortData(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' :
        this.sortDirection === 'desc' ? '' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    if (this.sortDirection === '') {
      this.sortColumn = '';
    }

    this.data = [...this.data].sort((a, b) => {
      if (this.sortDirection === '') return 0;

      const aValue = this.getFormattedValue(a[column]);
      const bValue = this.getFormattedValue(b[column]);

      if (aValue instanceof Date && bValue instanceof Date) {
        return this.sortDirection === 'asc' ?
          aValue.getTime() - bValue.getTime() :
          bValue.getTime() - aValue.getTime();
      }

      // Stable sort for string/number
      if (aValue === bValue) return 0;
      return this.sortDirection === 'asc'
        ? (aValue > bValue ? 1 : -1)
        : (aValue < bValue ? 1 : -1);
    });
  }

  onStatusChange(row: any, newStatus: string): void {
    this.statusChange.emit({ row, status: newStatus });
  }

  onEdit(row: any): void {
    this.edit.emit(row);
  }

  onDelete(row: any): void {
    this.delete.emit(row);
  }

  onView(row: any): void {
    this.view.emit(row);
  }
}

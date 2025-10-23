import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusLabel',
})
export class StatusLabelPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 1: return 'Doing';
      case 2: return 'Done';
      default: return 'Todo';
    }
  }
}


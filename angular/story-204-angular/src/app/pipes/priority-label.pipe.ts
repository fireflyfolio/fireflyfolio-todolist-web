import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priorityLabel',
})
export class PriorityLabelPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 0: return 'Low';
      case 2: return 'High';
      case 3: return 'Urgent';
      default: return 'Normal';
    }
  }
}

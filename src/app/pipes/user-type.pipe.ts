import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userType'
})
export class UserTypePipe implements PipeTransform {
  private userTypeNames: { [key in 'CLIENT' | 'EMPLOYEE']: string } = {
    'CLIENT': 'Client',
    'EMPLOYEE': 'Employee',
  };

  transform(value: string): string {
    return this.userTypeNames[value as 'CLIENT' | 'EMPLOYEE'] || value;
  }
}

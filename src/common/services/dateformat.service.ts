/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';

@Injectable()
export class DateFormatService {
    formatDate(date: Date): string {
        date = new Date(date);
        if (isNaN(date.getTime())) {
            return undefined;
          }
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript van de 0 a 11, por eso se suma 1
        const year = date.getFullYear().toString();
    
        return `${day}-${month}-${year}`;
      }
}

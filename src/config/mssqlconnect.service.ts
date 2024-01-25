/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import * as sql from 'mssql';

@Injectable()
export class MsSqlConnectService {
    private readonly config: sql.config;
    constructor() {
      this.config = {
        //type: "mssql",
        server: '192.168.0.251',
        user: 'sa',
        password: 'andrea2002',
       // database: 'NeumenApi',
  
        options: {
          encrypt: false,
          trustedConnection: true,
          // connectionRetry: true,
          requestTimeout: 30000,
          tdsVersion: '7_1',
        },
      };
    }
    async getConnection(): Promise<any> {
      try {
        const pool = await sql.connect(this.config);
        return pool;
      } catch (error) {
        console.error('Error al conectar a SQL Server:', error);
        throw error;
      }
    }
}

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { EmployeesResponseDto } from './get-employees-dto';
import {firstValueFrom} from "rxjs";

@Injectable()
export class KomboEmployeeService {
  private KOMBO_API_URL = 'https://api.kombo.dev/v1';
  private KOMBO_API_KEY = process.env.KOMBO_API_KEY;
  constructor(private readonly httpService: HttpService) {}

  async getEmployees(integrationId: string): Promise<EmployeesResponseDto> {
    try {
      console.log(`Getting employees from ${integrationId}`);
      const response = await firstValueFrom(
        this.httpService.get(`${this.KOMBO_API_URL}/hris/employees`, {
          headers: {
            'X-Integration-Id': integrationId,
            Accept: 'application/json',
            Authorization: `Bearer ${this.KOMBO_API_KEY}`,
          },
        }),
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw new HttpException(
        'Failed to fetch employees',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
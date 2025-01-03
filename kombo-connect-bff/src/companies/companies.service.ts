import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Repository } from 'typeorm';
import { KomboEmployeeService } from '../client/kombo-employee-service';
import {
  AgeInformation,
  EmployeesInformation,
} from './types/EmployeesInformation';
import { EmployeeDto } from '../client/get-employees-dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly komboEmployeeService: KomboEmployeeService,
  ) {}

  async getAllCompanies(): Promise<Company[]> {
    return this.companyRepository.find(); // Retourne toutes les entreprises
  }

  async getManagement(
    integrationId: string,
  ): Promise<{ id: string; name: string; manager_id: string; job_title: string }[]> {
    const employeesDto =
      await this.komboEmployeeService.getEmployees(integrationId);
    return employeesDto.results.map((employeeDto) => ({
      id: employeeDto.id,
      name: employeeDto.display_full_name,
      manager_id: employeeDto.manager_id,
      job_title: employeeDto.job_title,
    }));
  }

  async getEmployeesInformation(
    integrationId: string,
  ): Promise<EmployeesInformation> {
    const employeesDto =
      await this.komboEmployeeService.getEmployees(integrationId);
    console.log(employeesDto);
    const totalNumber = this.calculateTotalNumber(employeesDto.results);
    const femaleNumber = this.calculateFemaleNumber(employeesDto.results);
    const maleNumber = this.calculateMaleNumber(employeesDto.results);
    const genderRatio = this.calculateGenderRatio(femaleNumber, maleNumber);
    const age = this.calculateAgeInformation(employeesDto.results);

    return {
      totalNumber,
      femaleNumber,
      maleNumber,
      genderRatio,
      age,
    };
  }

  // Private methods for calculations

  private calculateTotalNumber(employees: EmployeeDto[]): number {
    return employees.length;
  }

  private calculateFemaleNumber(employees: EmployeeDto[]): number {
    return employees.filter((employee) => employee.gender === 'FEMALE').length;
  }

  private calculateMaleNumber(employees: EmployeeDto[]): number {
    return employees.filter((employee) => employee.gender === 'MALE').length;
  }

  private calculateGenderRatio(
    femaleNumber: number,
    maleNumber: number,
  ): number {
    if (maleNumber === 0) return femaleNumber > 0 ? Infinity : 0;
    return femaleNumber / maleNumber;
  }

  private calculateAgeInformation(employees: EmployeeDto[]): AgeInformation {
    const ages = employees
      .filter((employee) => employee.date_of_birth)
      .map((employee) =>
        this.calculateAgeFromBirthDate(employee.date_of_birth),
      );

    const ageAverage = this.calculateAverageAge(ages);
    const total = ages.length;
    return {
      ageAverage,
      employeesOver61yearPercentage: this.calculatePercentage(
        ages,
        (age) => age > 61,
        total,
      ),
      employeesBetween21And30yearPercentage: this.calculatePercentage(
        ages,
        (age) => age >= 21 && age <= 30,
        total,
      ),
      employeesBetween31And40yearPercentage: this.calculatePercentage(
        ages,
        (age) => age >= 31 && age <= 40,
        total,
      ),
      employeesBetween41And50yearPercentage: this.calculatePercentage(
        ages,
        (age) => age >= 41 && age <= 50,
        total,
      ),
      employeesBetween51And60yearPercentage: this.calculatePercentage(
        ages,
        (age) => age >= 51 && age <= 60,
        total,
      ),
    };
  }

  private calculateAgeFromBirthDate(birthDate: string): number {
    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();

    if (
      now.getMonth() < birth.getMonth() ||
      (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
    ) {
      age -= 1;
    }

    return age;
  }

  private calculateAverageAge(ages: number[]): number {
    if (ages.length === 0) return 0;
    const sum = ages.reduce((total, age) => total + age, 0);
    return sum / ages.length;
  }

  private calculatePercentage(
    ages: number[],
    condition: (age: number) => boolean,
    total: number,
  ): number {
    if (total === 0) return 0;
    const count = ages.filter(condition).length;
    return (count / total) * 100;
  }
}

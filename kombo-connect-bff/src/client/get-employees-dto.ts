
class AddressDto {
  city?: string;
  country?: string;
  state?: string;
  street_1?: string;
  street_2?: string;
  zip_code?: string;
  raw?: string;
}

class GroupDto {
  id: string;
  remote_id: string;
  name: string;
  type: string;
}

class ManagerDto {
  id?: string;
  first_name?: string;
  last_name?: string;
  display_full_name?: string;
  work_email?: string;
  remote_id?: string;
  employment_status?: string;
  termination_date?: string;
}

class WorkLocationDto {
  id: string;
  remote_id: string;
  name: string;
  address: AddressDto;
  type: string;
  changed_at?: string;
  remote_deleted_at?: string;
}

class LegalEntityDto {
  id: string;
  remote_id: string;
  name: string;
  address: AddressDto;
}

export class EmployeesResponseDto {
  results: EmployeeDto[];
  next?: string;
  previous?: string;
}

export class EmployeeDto {
  id: string;
  remote_id: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  nationality: string;
  display_full_name: string;
  job_title?: string;
  work_email?: string;
  employment_status?: string;
  employment_type?: string;
  weekly_hours?: number;
  work_location: WorkLocationDto;
  groups: GroupDto[];
  manager?: ManagerDto;
  gender: string;
  date_of_birth: string;
  start_date?: string;
  termination_date?: string;
  remote_created_at?: string;
  changed_at?: string;
  legal_entity: LegalEntityDto;
}

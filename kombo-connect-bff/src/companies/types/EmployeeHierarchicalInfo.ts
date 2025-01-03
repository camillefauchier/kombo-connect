export interface EmployeeHierarchicalInfo {
  id: number;
  name: string;
  manager_id: number | null;
  job_title?: string;
}

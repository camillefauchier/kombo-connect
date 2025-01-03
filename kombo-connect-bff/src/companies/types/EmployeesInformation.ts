export type EmployeesInformation = {
  totalNumber: number;
  femaleNumber: number;
  maleNumber: number;
  genderRatio: number;
  age: AgeInformation;
};

export type AgeInformation = {
  ageAverage: number;
  employeesOver61yearPercentage: number;
  employeesBetween21And30yearPercentage: number;
  employeesBetween31And40yearPercentage: number;
  employeesBetween41And50yearPercentage: number;
  employeesBetween51And60yearPercentage: number;
};

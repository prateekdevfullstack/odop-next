export function districtSupervisorBasePath(): string {
  return "/district-supervisor";
}

export function districtSupervisorLoginPath(): string {
  return districtSupervisorBasePath();
}

export function districtSupervisorDashboardPath(): string {
  return `${districtSupervisorBasePath()}/dashboard`;
}

export function districtSupervisorDistrictPath(): string {
  return `${districtSupervisorBasePath()}/district`;
}

export function districtSupervisorSupplierAccessLogsPath(): string {
  return `${districtSupervisorBasePath()}/supplier-access-logs`;
}

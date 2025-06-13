export default function CompaniesPage() {
  const { data, loading, error } = useTableData(() =>
    backendApiService.getCompanies()
  );
  const companies = data?.map(transformCompanyFromApi) || [];
  const config = {
    type: "companies",
    columns: TABLE_COLUMNS["companies"],
    title: TABLE_TITLES["companies"],
    pageSize: 10,
    // Diğer configler eklenebilir
  };

  return (
    <DataTable
      data={companies}
      config={config}
      loading={loading}
      error={error}
    />
  );
}

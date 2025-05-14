import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../../components/common/ComponentCard";
import PageMeta from "../../../../components/common/PageMeta";
import BasicTableOne from "../../../../components/tables/BasicTables/BasicTableOne";
import BasicTableTwo from "../../../../components/tables/BasicTables/BasicTableTwo";
import BasicTableFour from "../../../../components/tables/BasicTables/BasicTableFour";
import BasicTableFive from "../../../../components/tables/BasicTables/BasicTableFive";

export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Basic Tables" />
      <div className="space-y-6">
        <ComponentCard title="Utilisateurs">
          <BasicTableOne />
        </ComponentCard>
        <ComponentCard title="Talks">
          <BasicTableTwo />
        </ComponentCard>
        <ComponentCard title="Plannings">
          <BasicTableTwo />
        </ComponentCard>
        <ComponentCard title="Salles">
          <BasicTableFour />
        </ComponentCard>
        <ComponentCard title="Roles">
          <BasicTableFive />
        </ComponentCard>
      </div>
    </>
  );
}

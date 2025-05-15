import { useEffect, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import UsersTable from "../../../components/tables/BasicTables/UsersTable";
import TalksTable from "../../../components/tables/BasicTables/TalksTable";
import PlanningsTable from "../../../components/tables/BasicTables/PlanningsTable";
import RoomsTable from "../../../components/tables/BasicTables/RoomsTable";
import RolesTable from "../../../components/tables/BasicTables/RolesTable";
import MyTalksTable from "../../../components/tables/BasicTables/MyTalksTable";


export default function BasicTables() {
  const [role, setRole] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role);
      } catch {
        setRole(null);
      }
    }
  }, []);
  if (role === null) return null;
  return (
    <>
      <PageMeta
        title="TalkMaster Tables | Tableau de bord"
        description="Ceci est la page des tables du tableau de bord de TalkMaster"
      />
      <PageBreadcrumb pageTitle="Tables" />
      <div className="space-y-6">
        {/* Utilisateurs : role = 4 (ADMINISTRATEUR) uniquement */}
        {role === 4 && (
          <ComponentCard title="Utilisateurs">
            <UsersTable />
          </ComponentCard>
        )}

        {/* Talks : role = 4 (ADMINISTRATEUR) ou 2 (ORGANISATEUR) */}
        {(role === 4 || role === 2) && (
          <ComponentCard title="Talks">
            <TalksTable />
          </ComponentCard>
        )}

        {/* Plannings (affiché à tous si tu veux) */}
        <ComponentCard title="Plannings">
          <PlanningsTable />
        </ComponentCard>

        {/* Salles (affiché à tous si tu veux) */}
        <ComponentCard title="Salles">
          <RoomsTable />
        </ComponentCard>

        {/* Roles (affiché à tous si tu veux) */}
        <ComponentCard title="Roles">
          <RolesTable />
        </ComponentCard>

        {/* Mes Talks : role = 4 (ADMINISTRATEUR) ou 1 (CONFÉRENCIER) */}
        {(role === 4 || role === 1) && (
          <ComponentCard title="Mes Talks">
            <MyTalksTable />
          </ComponentCard>
        )}
      </div>
    </>
  );
}

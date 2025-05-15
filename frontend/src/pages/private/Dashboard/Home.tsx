import DashboardMetrics from "../../../components/metrics/DashboardMetrics";
import PageMeta from "../../../../src/components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Tableau de bord | TalkMaster"
        description="Vue d’ensemble de votre activité sur TalkMaster : talks, utilisateurs, plannings et plus encore."
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <DashboardMetrics />
        </div>
      </div>
    </>
  );
}

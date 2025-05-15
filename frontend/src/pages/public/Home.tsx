import PageMeta from "../../components/common/PageMeta";
import PlanningOverview from "../../components/metrics/PlanningOverview";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Accueil | TalkMaster"
        description="Bienvenue sur la page d’accueil de TalkMaster, la plateforme de gestion de conférences."
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <PlanningOverview />
        </div>
      </div>
    </>
  );
}
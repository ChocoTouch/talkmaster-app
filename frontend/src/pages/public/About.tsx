import PageMeta from "../../components/common/PageMeta";

export default function About() {
  return (
    <>
      <PageMeta
        title="À propos | TalkMaster"
        description="En savoir plus sur TalkMaster, sa mission et les fonctionnalités proposées pour les organisateurs de conférences."
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <div>A propos</div>
        </div>
      </div>
    </>
  );
}

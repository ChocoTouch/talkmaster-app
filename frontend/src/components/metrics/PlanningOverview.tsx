import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";

interface Planning {
  id_planning: number;
  date: string;
  heure: string;
  talk_id: number;
  talk_titre: string;
  talk_description: string;
  talk_statut: string;
  salle_nom: string;
}

export default function PlanningOverview() {
  const [plannings, setPlannings] = useState<Planning[]>([]);
  const [selectedPlanning, setSelectedPlanning] = useState<Planning | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchPlannings = async () => {
      try {
        const res = await axiosInstance.get("/plannings/");
        setPlannings(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des plannings :", error);
      }
    };
    fetchPlannings();
  }, []);

  const openModal = (planning: Planning) => {
    setSelectedPlanning(planning);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedPlanning(null);
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader>Titre</TableCell>
                <TableCell isHeader>Statut</TableCell>
                <TableCell isHeader>Salle</TableCell>
                <TableCell isHeader>Date</TableCell>
                <TableCell isHeader>Heure</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {plannings.map((plan) => (
                <tr
  key={plan.id_planning}
  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-white/[0.05]"
  onClick={() => openModal(plan)}
                >
                  <TableCell>{plan.talk_titre}</TableCell>
                  <TableCell>
                    <Badge
                      size="sm"
                      color={
                        plan.talk_statut === "ACCEPTE"
                          ? "success"
                          : plan.talk_statut === "EN_ATTENTE"
                          ? "warning"
                          : plan.talk_statut === "PLANIFIE"
                          ? "info"
                          : "error"
                      }
                    >
                      {plan.talk_statut}
                    </Badge>
                  </TableCell>
                  <TableCell>{plan.salle_nom}</TableCell>
                  <TableCell>{plan.date}</TableCell>
                  <TableCell>{plan.heure}</TableCell>
                </tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow-xl dark:bg-gray-900">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Détails du Talk
            </Dialog.Title>
            {selectedPlanning && (
              <div className="space-y-2 text-sm">
                <p><strong>Titre :</strong> {selectedPlanning.talk_titre}</p>
                <p><strong>Description :</strong> {selectedPlanning.talk_description}</p>
                <p><strong>Statut :</strong> {selectedPlanning.talk_statut}</p>
                <p><strong>Salle :</strong> {selectedPlanning.salle_nom}</p>
                <p><strong>Date :</strong> {selectedPlanning.date}</p>
                <p><strong>Heure :</strong> {selectedPlanning.heure}</p>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                onClick={closeModal}
              >
                Fermer
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}

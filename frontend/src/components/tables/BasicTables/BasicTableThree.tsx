import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import axiosInstance from "../../../utils/axiosInstance";
import { useEffect, useState } from "react";

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

export default function BasicTableThree() {
  const [plannings, setPlannings] = useState<Planning[]>([]);

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

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Titre du Talk
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Description
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Statut
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Salle
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Date
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Heure
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {plannings.map((plan) => (
              <TableRow key={plan.id_planning}>
                <TableCell className="px-5 py-4 text-start">{plan.talk_titre}</TableCell>
                <TableCell className="px-5 py-4 text-start">{plan.talk_description}</TableCell>
                <TableCell className="px-5 py-4 text-start">
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
                <TableCell className="px-5 py-4 text-start">{plan.salle_nom}</TableCell>
                <TableCell className="px-5 py-4 text-start">{plan.date}</TableCell>
                <TableCell className="px-5 py-4 text-start">{plan.heure}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

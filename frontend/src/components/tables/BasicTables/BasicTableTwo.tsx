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

interface Conferencier {
  nom: string;
  email: string;
  id_utilisateur: number;
  id_role: number;
}

interface Talk {
  id_talk: number;
  titre: string;
  sujet: string;
  description: string;
  duree: number;
  niveau: "DEBUTANT" | "INTERMEDIAIRE" | "AVANCE";
  statut: "EN_ATTENTE" | "ACCEPTE" | "REFUSE" | "PLANIFIE";
  id_conferencier: number;
  conferencier: Conferencier;
  date: string;
  heure: string;
}

export default function BasicTableTwo() {
  const [talks, setTalks] = useState<Talk[]>([]);

  useEffect(() => {
    const fetchTalks = async () => {
      try {
        const res = await axiosInstance.get("/talks/");
        setTalks(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des talks :", error);
      }
    };
    fetchTalks();
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Titre
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Sujet
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Conférencier
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Durée
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Niveau
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Statut
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {talks.map((talk) => (
              <TableRow key={talk.id_talk}>
                <TableCell className="px-5 py-4 text-start">{talk.titre}</TableCell>
                <TableCell className="px-5 py-4 text-start">{talk.sujet}</TableCell>
                <TableCell className="px-5 py-4 text-start">
                  <div>
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {talk.conferencier.nom}
                    </span>
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {talk.conferencier.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-5 py-4 text-start">{talk.duree} min</TableCell>
                <TableCell className="px-5 py-4 text-start">
                  <Badge size="sm" color="info">{talk.niveau}</Badge>
                </TableCell>
                <TableCell className="px-5 py-4 text-start">
                  <Badge
                    size="sm"
                    color={
                      talk.statut === "ACCEPTE"
                        ? "success"
                        : talk.statut === "EN_ATTENTE"
                        ? "warning"
                        : talk.statut === "PLANIFIE"
                        ? "info"
                        : "error"
                    }
                  >
                    {talk.statut}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

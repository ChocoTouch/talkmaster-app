import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import axiosInstance from "../../../utils/axiosInstance";
import { useEffect, useState } from "react";

interface Salle {
  id_salle: number;
  nom_salle: string;
  capacite: number;
}

export default function BasicTableFour() {
  const [salles, setSalles] = useState<Salle[]>([]);

  useEffect(() => {
    const fetchSalles = async () => {
      try {
        const res = await axiosInstance.get("/salles");
        setSalles(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des salles :", error);
      }
    };
    fetchSalles();
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Nom de la salle
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Capacité
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {salles.map((salle) => (
              <TableRow key={salle.id_salle}>
                <TableCell className="px-5 py-4 text-start">{salle.nom_salle}</TableCell>
                <TableCell className="px-5 py-4 text-start">{salle.capacite}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

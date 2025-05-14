import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import axiosInstance from "../../../utils/axiosInstance";
import { useEffect, useState } from "react";

interface Role {
  id_role: number;
  nom_role: string;
}

export default function BasicTableFive() {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axiosInstance.get("/roles");
        setRoles(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des rôles :", error);
      }
    };
    fetchRoles();
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
                Nom du rôle
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {roles.map((role) => (
              <TableRow key={role.id_role}>
                <TableCell className="px-5 py-4 text-start">{role.nom_role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

import { User } from "./users";

export interface Talk {
  id_talk: number;
  titre: string;
  sujet: string;
  description: string;
  duree: number;
  niveau: "DEBUTANT" | "INTERMEDIAIRE" | "AVANCE";
  statut: "EN_ATTENTE" | "ACCEPTE" | "REFUSE" | "PLANIFIE";
  id_user?: number;
  user?: User;
  date?: string;
  heure?: string;
}


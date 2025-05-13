-- CreateEnum
CREATE TYPE "NomRole" AS ENUM ('CONFERENCIER', 'ORGANISATEUR', 'PUBLIC');

-- CreateEnum
CREATE TYPE "Niveau" AS ENUM ('DEBUTANT', 'INTERMEDIAIRE', 'AVANCE');

-- CreateEnum
CREATE TYPE "StatutTalk" AS ENUM ('EN_ATTENTE', 'ACCEPTE', 'REFUSE', 'PLANIFIE');

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id_utilisateur" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "id_role" INTEGER NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id_utilisateur")
);

-- CreateTable
CREATE TABLE "Role" (
    "id_role" SERIAL NOT NULL,
    "nom_role" "NomRole" NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id_role")
);

-- CreateTable
CREATE TABLE "Talk" (
    "id_talk" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duree" INTEGER NOT NULL,
    "niveau" "Niveau" NOT NULL,
    "sujet" TEXT NOT NULL,
    "statut" "StatutTalk" NOT NULL,
    "id_conferencier" INTEGER NOT NULL,

    CONSTRAINT "Talk_pkey" PRIMARY KEY ("id_talk")
);

-- CreateTable
CREATE TABLE "Salle" (
    "id_salle" SERIAL NOT NULL,
    "nom_salle" TEXT NOT NULL,
    "capacite" INTEGER NOT NULL,

    CONSTRAINT "Salle_pkey" PRIMARY KEY ("id_salle")
);

-- CreateTable
CREATE TABLE "Planning" (
    "id_planning" SERIAL NOT NULL,
    "date_heure" TIMESTAMP(3) NOT NULL,
    "id_talk" INTEGER NOT NULL,
    "id_salle" INTEGER NOT NULL,
    "id_organisateur" INTEGER NOT NULL,

    CONSTRAINT "Planning_pkey" PRIMARY KEY ("id_planning")
);

-- CreateTable
CREATE TABLE "Favori" (
    "id_favori" SERIAL NOT NULL,
    "id_utilisateur" INTEGER NOT NULL,
    "id_talk" INTEGER NOT NULL,

    CONSTRAINT "Favori_pkey" PRIMARY KEY ("id_favori")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id_feedback" SERIAL NOT NULL,
    "id_utilisateur" INTEGER NOT NULL,
    "id_talk" INTEGER NOT NULL,
    "commentaire" TEXT NOT NULL,
    "note" INTEGER NOT NULL,
    "date_feedback" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id_feedback")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Planning_id_talk_key" ON "Planning"("id_talk");

-- CreateIndex
CREATE UNIQUE INDEX "Favori_id_utilisateur_id_talk_key" ON "Favori"("id_utilisateur", "id_talk");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_id_utilisateur_id_talk_key" ON "Feedback"("id_utilisateur", "id_talk");

-- AddForeignKey
ALTER TABLE "Utilisateur" ADD CONSTRAINT "Utilisateur_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "Role"("id_role") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Talk" ADD CONSTRAINT "Talk_id_conferencier_fkey" FOREIGN KEY ("id_conferencier") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Planning" ADD CONSTRAINT "Planning_id_talk_fkey" FOREIGN KEY ("id_talk") REFERENCES "Talk"("id_talk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Planning" ADD CONSTRAINT "Planning_id_salle_fkey" FOREIGN KEY ("id_salle") REFERENCES "Salle"("id_salle") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Planning" ADD CONSTRAINT "Planning_id_organisateur_fkey" FOREIGN KEY ("id_organisateur") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favori" ADD CONSTRAINT "Favori_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favori" ADD CONSTRAINT "Favori_id_talk_fkey" FOREIGN KEY ("id_talk") REFERENCES "Talk"("id_talk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_id_talk_fkey" FOREIGN KEY ("id_talk") REFERENCES "Talk"("id_talk") ON DELETE RESTRICT ON UPDATE CASCADE;

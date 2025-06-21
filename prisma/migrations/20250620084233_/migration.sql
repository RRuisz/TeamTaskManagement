/*
  Warnings:

  - A unique constraint covering the columns `[team_id,user_id]` on the table `Team_membership` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Team_membership_team_id_user_id_key" ON "Team_membership"("team_id", "user_id");

import { Module } from '@nestjs/common';
import {TeamMembershipController} from "./team-membership.controller";
import {TeamMembershipService} from "./team-membership.service";

@Module({
  controllers: [TeamMembershipController],
  providers: [TeamMembershipService]
})
export class TeamMembershipModule {}

import { Branch } from "./branch.interface";
import { PositionRole } from "./positionrole.interface";

export interface AuthenticatedResponse {
    token: string;
    branches: Branch[];
    positionRoles: PositionRole[];
}
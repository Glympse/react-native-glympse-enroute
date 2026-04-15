import type OrgConfig from "./OrgConfig";

export default interface Organization {
    id: number;
    referrerOrgId: number;
    name: string;
    adminEmail: string;
    config: OrgConfig;
}

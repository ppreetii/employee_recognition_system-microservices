import { Request, Response, NextFunction } from "express";

import { ForbiddenError } from "../errors/forbidden-error";
import { Roles } from "../types/roles";
import {
  EmployeeMapping,
  OrganizationMapping,
  ProjectMapping,
} from "../types/permissions-mapping";

export const hasPermissions = (action: Number) =>
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const isStandalone = req.params.isStandalone;
      if (isStandalone) return next();

      const role = req.currentUser?.role;
      if (isAllowed(role!, action)) return next();

      throw new ForbiddenError();
    } catch (error) {
      next(error);
    }
  };

function isAllowed(role: string, action: Number) {
  let mapping: Number[] = [];

  switch (role) {
    case Roles.Organization:
      mapping = OrganizationMapping;
      break;
    case Roles.Employee:
      mapping = EmployeeMapping;
      break;
    case Roles.Project:
      mapping = ProjectMapping;
      break;
  }

  if (mapping.length > 0 && mapping.includes(action)) return true;

  return false;
}

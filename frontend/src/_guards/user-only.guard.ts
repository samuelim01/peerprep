import { CanActivateFn } from '@angular/router';

export const userOnlyGuard: CanActivateFn = (route, state) => {
  return true;
};

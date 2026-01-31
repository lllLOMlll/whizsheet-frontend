import { signal } from '@angular/core';

export const isSideNavOpen = signal(false);

export function toggleSideNav(): void {
  isSideNavOpen.update(v => !v);
}

export function closeSideNav(): void {
  isSideNavOpen.set(false);
}

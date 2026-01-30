import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { isSideNavOpen } from '../nav-state';

@Component({
  selector: 'app-side-nav',
  imports: [RouterLink],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav {
  isOpen = isSideNavOpen;
}

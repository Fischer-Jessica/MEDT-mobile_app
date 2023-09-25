import {Component} from '@angular/core';
import {NavigationLink} from '../../types/NavigationLink';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage {

    private readonly navigationLinks: NavigationLink[] = [];

    public filteredNavigationLinks: NavigationLink[] = [];

    constructor() {
        this.navigationLinks = [
            {
                title: 'WebGL Square',
                icon: 'square',
                routerLink: '/web-gl-square-page'
            }
        ];
        this.filteredNavigationLinks = this.navigationLinks;
    }

    public filterNavigationLinks(searchQuery: string): void {
        this.filteredNavigationLinks = this.navigationLinks.filter((navigationLink: NavigationLink): boolean =>
            searchQuery.trim() === '' || navigationLink.title.toLowerCase().includes(searchQuery.trim().toLowerCase()));
    }
}

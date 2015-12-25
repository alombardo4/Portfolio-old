'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Projects',
    'state': 'Projects'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor(Auth) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
  }
}

angular.module('portfolioApp')
  .controller('NavbarController', NavbarController);

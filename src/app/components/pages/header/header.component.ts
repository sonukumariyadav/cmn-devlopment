import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  isDarkMode: boolean = false;
  isSidebarCollapsed: boolean = false;

  // // Toggle dark mode
  // toggleDarkMode(enableDarkMode: boolean) {
  //   this.isDarkMode = enableDarkMode;
  //   if (enableDarkMode) {
  //     document.body.classList.add('dark-mode');
  //   } else {
  //     document.body.classList.remove('dark-mode');
  //   }
  // }

  toggleDarkMode(data:boolean) {
    this.isDarkMode = !this.isDarkMode;
    const rootElement = document.documentElement; // <html> element
    if (data) {
      rootElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      rootElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }



  // Toggle sidebar collapse
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('active');
    }
  }

  ngOnInit() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-mode');
      this.isDarkMode = true;
    }
  }

 



}

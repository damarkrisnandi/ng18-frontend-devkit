import { Component, Injectable, signal, computed } from "@angular/core";
// import { loginComponentData } from "../refs/data/login";
// import { registerComponentData } from "../refs/data/register";
import { Doc } from "../models/docs.model";
// import { themeSwitcherComponentData } from "../refs/data/theme-switcher";
// import { twoColumnComponentData } from "../refs/data/two-columns";
// import { formGroupSingleColumnComponentData } from "../refs/data/form-group-single-column";
// import { categorizedMenuComponentData } from "../refs/data/categorized-menu";
// import { globalStateManagementData } from "../refs/data/global-state-management";


@Injectable({
  providedIn: 'root'
})
export class DocStore {
  private readonly state = {
    $docs: signal<Doc[]>([
      // loginComponentData,
      // registerComponentData,
      // themeSwitcherComponentData,
      // twoColumnComponentData,
      // formGroupSingleColumnComponentData,
      // categorizedMenuComponentData,
      // globalStateManagementData
    ]),
    $searchTerm: signal<string>('')
  }

  public readonly $docs = this.state.$docs.asReadonly();
  public readonly $searchTerm = this.state.$searchTerm.asReadonly();

  public readonly $filteredDocs = computed(() => this.$docs().filter(doc => {
    const searchTerm = this.$searchTerm().toLowerCase();
    return doc.header.toLowerCase().includes(searchTerm) ||
          //  doc.description.toLowerCase().includes(searchTerm) ||
           doc.files.some(file => file.name.toLowerCase().includes(searchTerm));
  }));

  setSearchTerm(term: string) {
    this.state.$searchTerm.set(term);
  }




}

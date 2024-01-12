import Handlebars from "handlebars";

import interfaces from "$lib/snippets/interfaces.hbs?raw";
import observables from "$lib/snippets/history.hbs?raw";

export const getInterfaces = (tables: TableType[]) => {
  const template = Handlebars.compile(interfaces);
  return template({ tables });
};

export const getObservables = (tables: TableType[]) => {
  const template = Handlebars.compile(observables);
  return template({ tables });
};

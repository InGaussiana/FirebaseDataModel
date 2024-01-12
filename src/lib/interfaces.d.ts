interface TableRow {
  id: string;
  name: string;
  type: string;
  connected?: Connections;
  required?: boolean;
}

interface TableType {
  id: string;
  title: string;
  position: { x: number; y: number };
  attributes: TableRow[];
}

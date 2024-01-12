<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { get } from "svelte/store";

  export let onSave: (tables: TableType[]) => void;
  export let tables: TableType[];

  const context: any = getContext("graph");
  const { edges, nodes } = context;

  onMount(() => {
    update();
  });

  const update = () => {
    const positions: { [x: string]: { x: number; y: number } } =
      Object.fromEntries(
        // @ts-ignore
        Object.entries(Object.fromEntries($nodes)).map(([key, node]) => {
          const { position } = node;
          return [key.slice(2), get(position)];
        })
      );

    const connections: { [x: string]: any } = {};

    // @ts-ignore
    $edges.forEach((edge) => {
      if (!edge?.target?.id || !edge?.source?.id) return;

      let [anchor_in, node_in] = edge.target.id
        .split("/")
        .map((x: string) => x.slice(2));
      let [anchor_out, node_out] = edge.source.id
        .split("/")
        .map((x: string) => x.slice(2));

      anchor_out = anchor_out.split("-")[1];

      if (!connections[node_out]) {
        connections[node_out] = {};
      }

      if (!connections[node_out][anchor_out]) {
        connections[node_out][anchor_out] = [];
      }

      connections[node_out][anchor_out].push([node_in, anchor_in]);
    });

    tables = tables.map((t) => ({
      ...t,
      position: positions[t.id],
      attributes: t.attributes.map((attr) => {
        const newAttr = { ...attr };

        if (connections[t.id]?.[attr.id]) {
          newAttr.connected = connections[t.id][attr.id];
        } else {
          delete newAttr.connected;
        }

        return newAttr;
      }),
    }));

    onSave(tables);
  };
</script>

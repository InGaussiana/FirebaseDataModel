<script>
  import { Edge } from "svelvet";

  /**
   * @type {(connections: any[]) => void}
   */
  export let disconnect;

  // @ts-ignore
  const handleDelete = (e) => {
    const connection = e.target.id
      .replace("-target", "")
      .split("+")
      // @ts-ignore
      .map((x) => x.split("/").map((x) => x.slice(2)));

    disconnect([[connection[0][1], connection[0][0]]]);
  };
</script>

<Edge end="arrow" step edgeClick={handleDelete} />

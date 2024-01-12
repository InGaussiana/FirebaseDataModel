<script lang="ts">
  import { Node, Anchor } from "svelvet";
  import Edge from "./Edge.svelte";

  export let id: string | number;
  export let title: string;
  export let position: { x: number; y: number };
  export let rows: TableRow[];
  export let onDelete: () => void;
  export let onUpdate: () => void;

  let editable = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<Node useDefaults {id} {position} let:disconnect>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="nodeWrapper" on:click={onUpdate}>
    <div class="inputs">
      <Anchor input multiple id={`${id}-in`} direction="west" />
    </div>

    <div id="container">
      <div id="heading">
        {#if editable}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <button
            title="Delete"
            class="material-symbols-outlined pointer danger"
            on:click|stopPropagation={() => {
              editable = false;
              onDelete();
            }}
          >
            delete
          </button>
        {/if}

        {#if editable}
          <div>
            <input type="text" bind:value={title} />
          </div>
        {:else}
          {title}
        {/if}

        <button
          title="Edit"
          class="material-symbols-outlined pointer"
          on:click|stopPropagation={() => (editable = !editable)}
        >
          {#if editable}
            save
          {:else}
            edit
          {/if}
        </button>
      </div>
      <table id="table">
        {#each rows as row}
          <tr>
            <td style="max-width: 10px;width: 10px;">
              {#if editable}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                  title="Delete attribute"
                  class="material-symbols-outlined pointer danger"
                  on:click|stopPropagation={() => {
                    rows = rows.filter((r) => r.id !== row.id);
                    onUpdate();
                  }}
                >
                  delete
                </div>
              {/if}
            </td>

            <td>
              {#if editable}
                <input type="text" bind:value={row.name} on:change={onUpdate} />
              {:else}
                <div
                  title="Make required"
                  class="pointer"
                  on:click={() => (row = { ...row, required: !row.required })}
                >
                  {row.name}
                  {#if row.required}*{/if}
                </div>
              {/if}
            </td>
            <td style="max-width: 60px;">
              {#if editable}
                <select bind:value={row.type} on:change={onUpdate}>
                  <option value="number">number</option>
                  <option value="Date">Date</option>
                  <option value="string">string</option>
                </select>
              {:else}
                {row.type}
              {/if}
            </td>

            <td style="max-width: 10px;">
              {#if row.connected}
                <Anchor
                  output
                  multiple
                  id={`${id}-${row.id}-out`}
                  direction="east"
                  connections={row.connected}
                >
                  <div slot="edge" on:click={(e) => console.log(e)}>
                    <Edge {disconnect} />
                  </div>
                </Anchor>
              {:else}
                <Anchor
                  output
                  multiple
                  id={`${id}-${row.id}-out`}
                  direction="east"
                >
                  <div slot="edge">
                    <Edge {disconnect} />
                  </div>
                </Anchor>
              {/if}
            </td>
          </tr>
        {/each}
        <tr>
          <td class="pointer" colspan={4} style="text-align:center;">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
              title="Add attribute"
              class="material-symbols-outlined"
              on:click|stopPropagation={() => {
                rows = [
                  ...rows,
                  {
                    id: `${rows.length}`,
                    name: "test",
                    type: "string",
                  },
                ];
                onUpdate();
              }}
            >
              add
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</Node>

<style>
  .pointer {
    cursor: pointer;
  }
  .nodeWrapper {
    box-sizing: border-box;
    width: fit-content;
    border-radius: 8px;
    height: fit-content;
    position: relative;
    pointer-events: auto;
    display: flex;
    flex-direction: column;
    padding: 1px;
    gap: 10px;
  }

  .inputs {
    position: absolute;
    top: 16px;
    left: -20px;
  }

  .danger {
    color: rgb(221, 76, 76);
  }

  input[type="text"] {
    width: 100%;
  }

  #heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgb(173, 196, 230);
    padding: 10px;
    font-size: 18px;
    font-weight: 600;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
  }

  #table td {
    padding-right: 20px;
    max-width: 150px;
    width: 100px;
    height: 30px;
    justify-content: space-evenly;
  }
</style>

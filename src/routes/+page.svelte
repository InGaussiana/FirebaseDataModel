<script lang="ts">
  import { Controls, Svelvet, ThemeToggle } from "svelvet";
  import Table from "$lib/Table.svelte";
  import Save from "$lib/Save.svelte";
  import { onMount } from "svelte";
  import { getInterfaces, getObservables } from "$lib/snippets";
  import JSZip from "jszip";
  // @ts-ignore
  import fs from "file-saver";

  let project = "project";
  let saving = false;
  let uploadInput: HTMLInputElement;
  let mounted = false;
  let tables: TableType[] = [
    {
      id: "1",
      title: "TABLA",
      position: { x: 0, y: 0 },
      attributes: [],
    },
  ];

  onMount(() => {
    reset();
  });

  const reset = () => {
    mounted = false;
    const tablesData = localStorage.getItem("tables");
    if (tablesData) {
      tables = JSON.parse(tablesData);
      if (tables.length == 0) {
        addNode();
      }
    }

    mounted = true;
  };

  const addNode = () => {
    tables = [
      ...tables,
      {
        id: `T${tables.length}`,
        title: `table ${tables.length}`,
        position: {
          x: tables.length ? Math.min(...tables.map((t) => t.position.x)) : 0,
          y: tables.length
            ? Math.min(...tables.map((t) => t.position.y)) - 200
            : 0,
        },
        attributes: [
          {
            id: "0",
            name: "attribute",
            type: "int",
          },
        ],
      },
    ];
    save();
  };

  const removeNode = (id: string) => {
    tables = tables.filter((t) => t.id !== id);
    save();
  };

  const save = () => {
    saving = true;
  };

  async function readJSONFile(file: Blob) {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.onload = (event) => {
        // @ts-ignore
        resolve(JSON.parse(event.target.result));
      };
      fileReader.onerror = (error) => reject(error);
      fileReader.readAsText(file);
    });
  }

  const loadJson = async (e: any) => {
    const result: any = await readJSONFile(e.target.files[0]);

    let newTables: any[];
    if (result.length) {
      newTables = result;
    } else {
      newTables = Object.entries(result).map(([key, table], i) => ({
        id: key,
        title: key,
        position: { x: 320 * i, y: 0 },
        // @ts-ignore
        attributes: Object.entries(table).map(([attrKey, attrType], i) => ({
          id: `${i}`,
          name: attrKey,
          type: attrType,
        })),
      }));
    }

    if (newTables.length) {
      // @ts-ignore
      tables = newTables;
      save();
    }
  };

  function downloadObj(exportObj: any, exportName: string) {
    var dataStr =
      "data:text/plain;charset=utf-8," +
      encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  function download() {
    downloadObj(tables, `${project}-data-model.json`);
  }

  function generateCode() {
    let zip = new JSZip();

    zip.file(
      "interfaces.d.ts",
      new Blob([getInterfaces(tables)], {
        type: "text/plain",
      })
    );

    zip.file(
      "history.ts",
      new Blob([getObservables(tables)], {
        type: "text/plain",
      })
    );

    zip.generateAsync({ type: "blob" }).then(function (content: any) {
      fs.saveAs(content, `${project}-code.zip`);
    });
  }
</script>

<body>
  {#if mounted}
    <Svelvet fitView controls minimap modifier="ctrl">
      {#each tables as table}
        <Table
          id={table.id}
          bind:rows={table.attributes}
          bind:title={table.title}
          position={table.position}
          onUpdate={save}
          onDelete={() => removeNode(table.id)}
        />
      {/each}

      {#if saving}
        <Save
          bind:tables
          onSave={(tables) => {
            console.log("Saving Change...");
            localStorage.setItem("tables", JSON.stringify(tables));
            saving = false;
          }}
        />
      {/if}

      <ThemeToggle main="dark" alt="light" slot="toggle" />

      <div slot="controls">
        <Controls corner="NW">
          <div style="margin-right: 33px;">
            <button
              title="Add table"
              class="material-symbols-outlined custom-button"
              on:click|stopPropagation={addNode}>add</button
            >
            <!-- <button
            title="Refresh project"
            class="material-symbols-outlined custom-button"
            on:click|stopPropagation={reset}>refresh</button
          > -->
            <button
              title="Upload project"
              class="material-symbols-outlined custom-button"
              on:click|stopPropagation={() => uploadInput.click()}
              >upload</button
            >
            <button
              title="Download project"
              class="material-symbols-outlined custom-button"
              on:click|stopPropagation={download}>download</button
            >
            <button
              title="Save project"
              class="material-symbols-outlined custom-button"
              on:click|stopPropagation={save}>Save</button
            >
            <button
              title="Generate code"
              class="material-symbols-outlined custom-button"
              on:click|stopPropagation={generateCode}>code</button
            >
            <input
              type="file"
              hidden
              bind:this={uploadInput}
              accept=".json"
              on:change={(e) => loadJson(e)}
            />
          </div>
        </Controls>
      </div>
    </Svelvet>
  {/if}
</body>

<style>
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: gray;
    width: 100vw;
    height: 100vh;
    padding: 0;
    margin: 0;
  }
  .custom-button {
    border: 1px solid;
    border-radius: 5px;
    height: 1.5em;
    cursor: pointer;
  }
</style>

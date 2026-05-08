# CLAUDE.md

This project uses graphify. A knowledge graph lives in `graphify-out/`.

## Before touching any file

1. Read `graphify-out/GRAPH_REPORT.md` — god nodes, structure, key relationships
2. If `graphify-out/wiki/index.md` exists, navigate it instead of raw files
3. Query the graph: `graphify query "<what you need>" --budget 1500`
4. Identify **leaf nodes** in the result (nodes with no further unvisited dependencies)
5. Read **only those leaf files** — never open a hub file for "context"

## After every code edit

```bash
graphify update .   # AST-only, no API cost
```

## Confidence tags on graph edges

- `EXTRACTED` — trust it
- `INFERRED` — verify if critical
- `AMBIGUOUS` — always verify with source

## Useful commands

```bash
graphify explain "Symbol"          # single node deep-dive
graphify path "NodeA" "NodeB"      # read only nodes on the returned path
graphify query "..." --dfs --budget 1500
```

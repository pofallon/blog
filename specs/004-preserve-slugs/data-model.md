# Data Model: Deterministic Slug Preservation

**Feature**: 004-preserve-slugs  
**Date**: 2025-12-16

## Entities

### ContentSourceFile

Represents a markdown entry under `content/blog`.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `relativePath` | `string` | Path relative to `content/blog/` | Required, must match `{post-folder}/index.md` pattern |
| `absolutePath` | `string` | Full filesystem path | Required |
| `collection` | `string` | Post folder name (e.g., "playlist-reinvent-2019") | Required, ASCII-safe characters |
| `filename` | `string` | Always "index.md" per FR-007 | Required, exactly "index.md" |
| `frontmatter` | `object` | Parsed YAML frontmatter | Optional, may contain title, date, description |

**Validation Rules**:
- Path must be exactly 1 level deep: `{post-folder}/index.md`
- Folder must contain exactly one `index.md` file
- Folder name must be lowercase, hyphenated, ASCII-safe

### SlugManifestEntry

Records the authoritative mapping for regression checking.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `relativePath` | `string` | Path relative to `content/blog/` | Primary key, unique |
| `slug` | `string` | Generated URL path | Required, format `/{collection}/` |
| `status` | `enum` | Verification result | `"match"` \| `"mismatch"` \| `"new"` |
| `lastVerified` | `string` | ISO 8601 timestamp | Optional, set during verification |

**State Transitions**:
- `new` → `match`: First verification passes
- `match` → `mismatch`: Slug changed (build failure)
- `mismatch` → `match`: Slug restored or manifest updated

### VerificationReport

Summarizes scan results for CI/CD and maintainers.

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | `string` | ISO 8601 execution time |
| `filesScanned` | `number` | Total content files processed |
| `matches` | `number` | Files with matching slugs |
| `mismatches` | `number` | Files with slug discrepancies |
| `newFiles` | `number` | Files not in manifest |
| `details` | `array` | List of mismatch details |
| `exitCode` | `number` | 0 if all match, 1 otherwise |

## Relationships

```
ContentSourceFile 1──────1 SlugManifestEntry
      │                         │
      │  generates              │  references
      ▼                         ▼
    Slug ◄─────────────── VerificationReport
                               (aggregates)
```

## JSON Schema: slug-manifest.json

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "version": { "type": "string", "pattern": "^\\d+\\.\\d+\\.\\d+$" },
    "generatedAt": { "type": "string", "format": "date-time" },
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "relativePath": { "type": "string" },
          "slug": { "type": "string", "pattern": "^/[a-z0-9-]+/$" }
        },
        "required": ["relativePath", "slug"]
      }
    }
  },
  "required": ["version", "entries"]
}
```

## Normalization Rules

| Input | Transformation | Output |
|-------|---------------|--------|
| Uppercase letters | Convert to lowercase | "MyPost" → "mypost" |
| Spaces | Replace with hyphens | "my post" → "my-post" |
| Consecutive hyphens | Collapse to single | "my--post" → "my-post" |
| Accented characters | Transliterate to ASCII | "café" → "cafe" |
| Non-alphanumeric | Remove (except hyphens) | "my_post!" → "mypost" |
| Leading/trailing hyphens | Trim | "-post-" → "post" |

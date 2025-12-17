# Quickstart: Open Source Projects Section

**Feature**: 010-projects-section  
**Date**: 2025-12-17

## Overview

This guide explains how to add, edit, and maintain projects in the open source projects catalog.

## Adding a New Project

### Step 1: Edit the Data File

Open `content/projects.json` and add a new project object to the `projects` array:

```json
{
  "projects": [
    // ... existing projects
    {
      "slug": "my-new-project",
      "name": "My New Project",
      "summary": "A brief description for the index page (keep under 160 characters).",
      "details": "A longer description explaining what the project does, its goals, and how others can contribute or use it.",
      "tags": ["typescript", "open-source"],
      "links": [
        {
          "label": "GitHub",
          "url": "https://github.com/username/my-new-project",
          "type": "primary"
        },
        {
          "label": "Documentation",
          "url": "https://my-new-project.dev/docs"
        }
      ]
    }
  ]
}
```

### Step 2: Add an Image (Optional)

If your project has a logo or preview image:

1. Add the image to `apps/site-shell/public/images/projects/`
2. Reference it in the project entry:

```json
{
  "slug": "my-new-project",
  // ... other fields
  "image": {
    "src": "/images/projects/my-new-project.png",
    "alt": "My New Project logo"
  }
}
```

### Step 3: Validate and Build

Run the build to validate your changes:

```bash
npm run build
```

The build will fail with clear error messages if:
- Required fields are missing
- The slug format is invalid (must be lowercase kebab-case)
- A duplicate slug exists
- A URL is malformed

### Step 4: Preview Locally

```bash
npm run dev
```

Visit:
- `http://localhost:3000/projects` - See your project in the list
- `http://localhost:3000/projects/my-new-project` - See the detail page

## Project Schema Reference

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `slug` | string | URL identifier (lowercase, hyphens only) | `"my-project"` |
| `name` | string | Display name | `"My Project"` |
| `summary` | string | Short description for cards | `"A tool for developers"` |
| `details` | string | Full description | `"Detailed explanation..."` |
| `tags` | string[] | At least one tag | `["typescript", "cli"]` |
| `links` | object[] | At least one link | See below |

### Link Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | string | ✅ | Display text | 
| `url` | string | ✅ | Full URL with protocol |
| `type` | string | ❌ | `"primary"` or `"secondary"` |

Mark your main repository or homepage as `"type": "primary"` for CTA button styling.

### Image Object (Optional)

| Field | Type | Description |
|-------|------|-------------|
| `src` | string | Path to image (relative to public/) |
| `alt` | string | Accessible description |

## Slug Guidelines

Valid slugs:
- ✅ `my-project`
- ✅ `project123`
- ✅ `a-b-c`

Invalid slugs:
- ❌ `My-Project` (uppercase)
- ❌ `my_project` (underscores)
- ❌ `my project` (spaces)
- ❌ `my--project` (consecutive hyphens)

## Common Tasks

### Editing an Existing Project

1. Find the project in `content/projects.json`
2. Update the desired fields
3. Run `npm run build` to validate
4. Commit and push

### Removing a Project

1. Delete the project object from `content/projects.json`
2. Remove any associated images from `apps/site-shell/public/images/projects/`
3. Run `npm run build` to verify
4. Commit and push

### Reordering Projects

Projects are displayed alphabetically by `name`. To change order, rename the project.

## Example: Complete Project Entry

```json
{
  "slug": "speckit",
  "name": "SpecKit",
  "summary": "A specification-driven development toolkit for AI-assisted software engineering.",
  "details": "SpecKit provides templates, workflows, and conventions for capturing requirements, generating implementation plans, and tracking development progress. It integrates with AI coding assistants to enable structured, traceable software development.",
  "tags": ["developer-tools", "ai", "specifications", "typescript"],
  "links": [
    {
      "label": "GitHub",
      "url": "https://github.com/user/speckit",
      "type": "primary"
    },
    {
      "label": "Documentation",
      "url": "https://speckit.dev/docs"
    },
    {
      "label": "npm",
      "url": "https://npmjs.com/package/speckit"
    }
  ],
  "image": {
    "src": "/images/projects/speckit-logo.png",
    "alt": "SpecKit logo - a blueprint icon"
  }
}
```

## Troubleshooting

### Build fails with "Slug must be lowercase kebab-case"

Your slug contains invalid characters. Use only:
- Lowercase letters (a-z)
- Numbers (0-9)
- Single hyphens between words

### Build fails with "Invalid URL format"

Ensure all URLs include the protocol:
- ✅ `https://github.com/user/repo`
- ❌ `github.com/user/repo`

### Project doesn't appear after build

1. Verify the JSON is valid (no trailing commas, matching brackets)
2. Check the build output for validation errors
3. Ensure the project is inside the `"projects"` array

### Image doesn't display

1. Verify the file exists at the specified path
2. Check the `src` path starts with `/images/projects/`
3. Ensure the `alt` text is provided

## Support

For questions or issues, open a GitHub issue or contact the maintainer.

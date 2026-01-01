# Project Documentation Template

Use this template to document projects for the get2know.io project pages. Fill in each section with project-specific information.

---

## Project Metadata

```yaml
slug: project-slug-here
name: Project Name
summary: One-sentence description of what the project does.
tags:
  - tag1
  - tag2
  - tag3
links:
  - label: GitHub
    url: https://github.com/username/repo
    type: primary
  - label: Documentation
    url: https://docs.example.com
  - label: npm/PyPI/etc
    url: https://npmjs.com/package/name
image:
  src: /images/projects/project-logo.png
  alt: Project logo description
```

---

## Overview

_2-3 sentences describing what the project is, who it's for, and the core problem it solves._

[PROJECT_NAME] is a [type of tool/framework/library] designed for [target audience] who need to [core use case]. It handles [key capabilities] out of the box, letting you focus on [what users care about] rather than [what it abstracts away].

---

## Key Features

_List 4-6 key features with brief explanations. Use this format:_

- **Feature Name**: Brief description of what this feature does and why it matters
- **Feature Name**: Brief description of what this feature does and why it matters
- **Feature Name**: Brief description of what this feature does and why it matters
- **Feature Name**: Brief description of what this feature does and why it matters
- **Feature Name**: Brief description of what this feature does and why it matters

---

## Use Cases

_Describe 4-6 scenarios where this project excels. Start with a brief intro sentence._

[PROJECT_NAME] excels in scenarios requiring [general category]:

- Use case 1 with brief context
- Use case 2 with brief context
- Use case 3 with brief context
- Use case 4 with brief context
- Use case 5 with brief context

---

## Technical Highlights

_2-3 sentences about the technical approach, architecture decisions, or implementation details that make this project interesting. Mention key technologies, patterns, or design decisions._

Built on [foundation/patterns], [PROJECT_NAME] leverages [key technology] for [benefit] while maintaining [important quality]. The [component/framework] supports [extensibility point] for [customization need] and [integration capability].

---

## Getting Started

_2-3 sentences describing how to get started. Mention the installation method and what the first steps look like._

Install [PROJECT_NAME] via [package manager] and [first action] in minutes. The [documentation/quickstart] walks through [initial example] with [what you'll learn].

---

## Architecture (Optional)

_If relevant, briefly describe the high-level architecture or key components._

---

## Output Format

When complete, the `details` field for projects.json should be formatted as a single string with `\n` for line breaks. Sections should be separated by double newlines. Example structure:

```
Overview

[Overview paragraph]

Key Features

- Feature 1: Description
- Feature 2: Description
...

Use Cases

[Intro sentence]

- Use case 1
- Use case 2
...

Technical Highlights

[Technical paragraph]

Getting Started

[Getting started paragraph]
```

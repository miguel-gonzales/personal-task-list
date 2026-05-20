# SW Spec Driven Development challenge

This challenge was designed as part of the Assuresoft's training process to start working with Spec-Driven Development methodology.

## Personal Task List
The challenge consist to propose a Personal Task List app that allow a user to create, edit, delete and mark a task as completed within the task list.

By applying Spec-Driven Development it is expected to produce:
- A vision document
- A list of user stories with Gherkin-style acceptance criteria
- A data model diagram
- An API contract written in OpenAPI.

Then, build a minimal REST API using the specification created, no authentication required for the first deliverable.
 **The goal** is not the code but the discipline to write the spec first and follow it strictly.

Although the use of AI is discouraged in the first part of this challenge, it is recommended for validation purposes only.

## The result

For this first part you will find this repository containing the `docs` directory with the next *deliverables:*

- vision.md: contains the product vision
- data-model.md: contains the MVP data model
- openapi.yaml: contains the API contract to be followed
- user-stories.md: contains the gherkin style user stories to be worked
- prompts.md: some of the prompts used as validators and helpers
- two reports.md files: used to document the project state and used as source of truth for later development

### API
As part of the challenge a minimum API was built using Nodejs, Express and Prisma in combination with typescript.

To start the API you need to move to the API directory and follow the steps on the [API_README.md](api/API_README.md)
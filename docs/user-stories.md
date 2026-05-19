## User Stories

### 1. CLI: Task Creation
**User Story:** As a developer, I want to add tasks directly from my terminal so that I don't have to context-switch away from my code.

```gherkin
Feature: CLI Task Creation

  Scenario: Successfully adding a new task via CLI
    Given the CLI is configured to point to the Taskminator API
    When I run the command "tm add 'Fix the memory leak'"
    Then the CLI should generate a unique UUID for the task
    And it should send a POST request to "/tasks" with the title "Fix the memory leak"
    And I should see a confirmation message "Task created successfully"
```

### 2. CLI: Task Management (List & Complete)
**User Story:** As a developer, I want to view my pending tasks and mark them as finished using simple commands.

```gherkin
Feature: CLI Task Management

  Scenario: Listing active tasks
    Given there are 3 tasks stored in the database with status "todo"
    When I run the command "tm list"
    Then the CLI should perform a GET request to "/tasks"
    And I should see a table displaying all 3 tasks with their IDs and titles

  Scenario: Marking a task as done using a positional index
    Given I have recently run "tm list"
    And the task "Fix memory leak" is at index "1" with ID "550e8400-e29b-41d4-a716-446655440000"
    When I run the command "tm done 1"
    Then the CLI should resolve index "1" to UUID "550e8400-e29b-41d4-a716-446655440000"
    And it should send a PATCH request to "/tasks/550e8400-e29b-41d4-a716-446655440000" with {"status": "done"}
    And I should see "Task 1 marked as completed"

  Scenario: List updates correctly after a task is completed
    Given I have two tasks: "Task A" (todo) and "Task B" (todo)
    When I run the command "tm done 1" 
    And I run the command "tm list"
    Then the CLI should perform a GET request to "/tasks"
    And "Task A" should be shown as "done" (or removed from the active list)
    And "Task B" should still be shown as "todo"  
```


### 3. Web UI: Task Visibility
**User Story:** As a user, I want to see my tasks on a web dashboard so that I have a visual overview of my productivity across devices.

```gherkin
Feature: Web Dashboard Visibility

  Scenario: Viewing the task list on the web
    Given I open the Taskminator Web UI
    And the API returns a list of 5 tasks
    Then I should see a "Terminal" themed dashboard
    And all 5 tasks should be rendered in the list
    And tasks with status "done" should appear visually distinct from "todo" tasks
```

### 4. API: Soft-Delete Functionality
**User Story:** As a developer, I want to delete tasks without permanently losing the data immediately so that I can support "undo" functionality in the future.

```gherkin
Feature: Task Deletion

  Scenario: Soft-deleting a task
    Given a task exists with ID "123-uuid"
    When the client sends a DELETE request to "/tasks/123-uuid"
    Then the system should update the "deleted_at" field with the current timestamp
    And a subsequent GET request to "/tasks" should not return this task in the active list
    And the response code should be 204
```

5. Synchronization & Conflict Resolution
**User Story:** As a multi-device user, I want my local CLI and Web UI to stay in sync based on the latest changes.

```gherkin
Feature: Task Synchronization

  Scenario: Last Write Wins Resolution
    Given a task has an "updated_at" timestamp of "10:00:00"
    When I update the task title via the Web UI at "10:05:00"
    And I update the same task status via the CLI at "10:05:05"
    Then the final state of the task in the database should reflect the CLI update
    And the "updated_at" field should be set to "10:05:05"
```


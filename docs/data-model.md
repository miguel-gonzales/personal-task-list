## Data model (MVP - No Auth)

### Entity: Task
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | Unique identifier |
| `title` | String |Required, 280 char | The task description |
| `status` | Enum/String | 'todo' by default | State engine of the app for tracking status|  
| `created_at` | Timestamp | Required | Automatic creation timestamp |
| `updated_at` | Timestamp | Required | Crucial for sync strategy ('Last write wins') |
| `deleted_at` | Timestamp | Required | For soft delete strategy |

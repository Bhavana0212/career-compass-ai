{
  "name": "Project",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Project title"
    },
    "description": {
      "type": "string",
      "description": "Detailed project description"
    },
    "career_relevance": {
      "type": "string",
      "description": "Target career path"
    },
    "skills_practiced": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "difficulty_level": {
      "type": "string",
      "enum": [
        "beginner",
        "intermediate",
        "advanced"
      ]
    },
    "estimated_hours": {
      "type": "number",
      "description": "Estimated completion time in hours"
    },
    "requirements": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Technical requirements and prerequisites"
    },
    "deliverables": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Expected project outcomes"
    },
    "resources": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "url": {
            "type": "string"
          },
          "type": {
            "type": "string",
            "enum": [
              "documentation",
              "tutorial",
              "tool",
              "dataset"
            ]
          }
        }
      }
    },
    "completion_status": {
      "type": "string",
      "enum": [
        "not_started",
        "in_progress",
        "completed"
      ],
      "default": "not_started"
    },
    "assigned_to_user": {
      "type": "string",
      "description": "User ID this project was assigned to"
    }
  },
  "required": []
}
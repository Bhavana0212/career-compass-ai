{
  "name": "LearningPath",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Learning path title"
    },
    "target_career": {
      "type": "string",
      "description": "Target career path"
    },
    "skill_gaps": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Skills to be developed"
    },
    "courses": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "provider": {
            "type": "string"
          },
          "url": {
            "type": "string"
          },
          "duration": {
            "type": "string"
          },
          "difficulty": {
            "type": "string",
            "enum": [
              "beginner",
              "intermediate",
              "advanced"
            ]
          },
          "cost": {
            "type": "string",
            "enum": [
              "free",
              "paid",
              "freemium"
            ]
          },
          "priority": {
            "type": "number",
            "minimum": 1,
            "maximum": 10
          }
        }
      }
    },
    "estimated_duration": {
      "type": "string",
      "description": "Total estimated completion time"
    },
    "difficulty_level": {
      "type": "string",
      "enum": [
        "beginner",
        "intermediate",
        "advanced"
      ]
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
    "created_for_user": {
      "type": "string",
      "description": "User ID this path was created for"
    }
  },
  "required": []
}
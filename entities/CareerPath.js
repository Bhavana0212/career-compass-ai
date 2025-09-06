{
  "name": "CareerPath",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Career path title"
    },
    "industry": {
      "type": "string",
      "description": "Industry sector"
    },
    "description": {
      "type": "string",
      "description": "Detailed career path description"
    },
    "required_skills": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "skill": {
            "type": "string"
          },
          "importance": {
            "type": "string",
            "enum": [
              "essential",
              "important",
              "preferred"
            ]
          },
          "proficiency_needed": {
            "type": "string",
            "enum": [
              "beginner",
              "intermediate",
              "advanced",
              "expert"
            ]
          }
        }
      }
    },
    "salary_range": {
      "type": "object",
      "properties": {
        "min": {
          "type": "number"
        },
        "max": {
          "type": "number"
        },
        "currency": {
          "type": "string",
          "default": "USD"
        }
      }
    },
    "job_outlook": {
      "type": "string",
      "enum": [
        "declining",
        "stable",
        "growing",
        "rapidly_growing"
      ],
      "description": "Future job market outlook"
    },
    "typical_progression": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Career progression steps"
    },
    "match_score": {
      "type": "number",
      "description": "AI-calculated match score for user"
    },
    "recommended_for_user": {
      "type": "string",
      "description": "User ID this recommendation is for"
    }
  },
  "required": []
}
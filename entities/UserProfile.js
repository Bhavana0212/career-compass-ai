{
  "name": "UserProfile",
  "type": "object",
  "properties": {
    "current_role": {
      "type": "string",
      "description": "Current role or student status"
    },
    "experience_level": {
      "type": "string",
      "enum": [
        "student",
        "entry_level",
        "1-3_years",
        "3-5_years",
        "5+_years"
      ],
      "description": "Professional experience level"
    },
    "education_background": {
      "type": "string",
      "description": "Educational background"
    },
    "skills": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "proficiency": {
            "type": "string",
            "enum": [
              "beginner",
              "intermediate",
              "advanced",
              "expert"
            ]
          },
          "category": {
            "type": "string",
            "enum": [
              "technical",
              "soft",
              "domain",
              "language",
              "tool"
            ]
          }
        }
      }
    },
    "career_interests": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "preferred_industries": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "career_goals": {
      "type": "string",
      "description": "Short and long-term career aspirations"
    },
    "resume_url": {
      "type": "string",
      "description": "URL to uploaded resume file"
    },
    "last_assessment_date": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": []
}
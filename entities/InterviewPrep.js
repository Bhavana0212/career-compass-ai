{
  "name": "InterviewPrep",
  "type": "object",
  "properties": {
    "career_focus": {
      "type": "string",
      "description": "Target career/role for interview prep"
    },
    "question_type": {
      "type": "string",
      "enum": [
        "behavioral",
        "technical",
        "situational",
        "case_study"
      ],
      "description": "Type of interview question"
    },
    "question": {
      "type": "string",
      "description": "Interview question"
    },
    "suggested_answer": {
      "type": "string",
      "description": "Sample answer or approach"
    },
    "key_points": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Key points to cover in answer"
    },
    "difficulty_level": {
      "type": "string",
      "enum": [
        "entry",
        "mid",
        "senior"
      ]
    },
    "practice_status": {
      "type": "string",
      "enum": [
        "new",
        "practiced",
        "mastered"
      ],
      "default": "new"
    },
    "user_answer": {
      "type": "string",
      "description": "User's practice answer"
    },
    "feedback": {
      "type": "string",
      "description": "AI feedback on user's answer"
    },
    "generated_for_user": {
      "type": "string",
      "description": "User ID this was generated for"
    }
  },
  "required": []
}
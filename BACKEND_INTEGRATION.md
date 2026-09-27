# StatSkill AI — Frontend / Django handoff

The existing `src/styles.css` was intentionally left unchanged. New learner/auth UI uses component-level inline styles so the existing homepage look is preserved.

## Backend stack selected
- Django + Django REST Framework
- MongoDB (or a MongoDB-compatible Django integration)
- Authentication: JWT/session, depending on backend decision

## API contracts to connect later

### Authentication
- `POST /api/auth/login/`
  - body: `{ "email": "...", "password": "..." }`
  - response: `{ "access": "...", "refresh": "...", "user": {...} }`
- `POST /api/auth/register/`
- `POST /api/auth/send-otp/`
- `POST /api/auth/verify-otp/`

### Learner profile
- `GET /api/learner/profile/`
- `GET /api/learner/competency/`
- `GET /api/learner/skill-gaps/`
- `GET /api/learner/roadmap/`
- `GET /api/learner/recommendations/`

### Courses
- `GET /api/courses/`
- `GET /api/courses/:id/`
- `POST /api/courses/:id/progress/`
- `POST /api/courses/:id/complete/`

### Assessment
- `POST /api/assessments/generate/` — send uploaded document + settings
- `POST /api/assessments/submit/` — send answers and course/assessment id
- response should include:
  - `score`
  - `passed` (true when score >= 80)
  - `competency_updates`
  - `skill_gaps`
  - `next_course`
  - `unlocked_course_ids`

## Frontend flow to preserve

1. Learner completes a course/module.
2. Learner takes assessment or reassessment.
3. Backend evaluates answers and updates competency/skill-gap data.
4. Backend returns the next recommendation immediately.
5. If `score >= 80`, frontend shows the animated congratulations modal and unlocks the returned next course.
6. If `score < 80`, frontend shows skill-gap/remedial recommendations and keeps the next roadmap node locked.

## Where to replace mock logic

- `src/context/AppContext.jsx` — replace demo login with API authentication.
- `src/components/AuthPages.jsx` — connect login/register/OTP forms.
- `src/components/learner/LearnerApp.jsx` — replace local state with API responses.
- `src/data/learningData.js` — remove mock course/roadmap/skill-gap data after APIs are ready.

Search for `BACKEND NOTE` / `BACKEND TODO` comments in the source for handoff points.

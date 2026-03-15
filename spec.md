# Healthy Meal Planner

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- User authentication (register/login) with health goal selection
- Dashboard showing current health goal and weekly meal plan summary
- Weekly meal plan generator with breakfast, lunch, and dinner for 7 days
- Each meal includes: name, recipe steps, ingredients list, estimated calories
- Grocery list page aggregating all ingredients from the weekly meal plan
- Profile page showing user info and health goal
- Bottom navigation bar: Home, Meal Plan, Grocery List, Profile
- Mobile-first responsive UI

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Select `authorization` component for user auth
2. Generate Motoko backend with:
   - User profile storage (health goal)
   - Meal plan data model (7 days x 3 meals, with recipe, ingredients, calories)
   - Meal plan generation logic per health goal
   - Grocery list aggregation from weekly plan
3. Frontend:
   - Auth screens (login/register)
   - Onboarding: health goal selection
   - Home dashboard with goal summary and plan overview
   - Meal Plan page with daily tabs and meal cards
   - Grocery list page with ingredient checklist
   - Profile page
   - Bottom nav bar with 4 tabs

import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module HealthGoal {
    public type T = { #weight_loss; #muscle_gain; #balanced_diet };

    public func fromText(t : Text) : T {
      switch (t) {
        case ("weight_loss") { #weight_loss };
        case ("muscle_gain") { #muscle_gain };
        case ("balanced_diet") { #balanced_diet };
        case (_) { Runtime.trap("Invalid health goal ") };
      };
    };
  };

  module MealType {
    public type T = { #breakfast; #lunch; #dinner };

    public func fromText(t : Text) : T {
      switch (t) {
        case ("breakfast") { #breakfast };
        case ("lunch") { #lunch };
        case ("dinner") { #dinner };
        case (_) { Runtime.trap("Invalid meal type") };
      };
    };
  };

  public type Ingredient = {
    name : Text;
    quantity : Text;
  };

  public type GroceryItem = {
    name : Text;
    totalQuantity : Text;
  };

  public type UserProfile = {
    displayName : Text;
    healthGoal : HealthGoal.T;
  };

  public type Meal = {
    name : Text;
    mealType : MealType.T;
    ingredients : [Ingredient];
    recipeSteps : [Text];
    calories : Nat;
    healthGoal : HealthGoal.T;
  };

  public type DailyMeals = {
    breakfast : Text;
    lunch : Text;
    dinner : Text;
  };

  public type WeeklyPlan = {
    monday : DailyMeals;
    tuesday : DailyMeals;
    wednesday : DailyMeals;
    thursday : DailyMeals;
    friday : DailyMeals;
    saturday : DailyMeals;
    sunday : DailyMeals;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let userMealPlans = Map.empty<Principal, WeeklyPlan>();

  func getPredefinedMeals(_healthGoal : HealthGoal.T) : [Meal] {
    [
      // Weight Loss Meals
      {
        name = "இடியாப்பம்";
        mealType = #breakfast;
        ingredients = [
          { name = "அரிசி மாவு"; quantity = "250 கிராம்" },
          { name = "தண்ணீர்"; quantity = "200 மில்லி" },
        ];
        recipeSteps = ["அரிசி மாவுடன் தண்ணீர் சேர்க்கவும்", "இடியாப்பம் வடிவமைக்கவும்"];
        calories = 150;
        healthGoal = #weight_loss;
      },
      {
        name = "சாமை சாதம்";
        mealType = #lunch;
        ingredients = [
          { name = "சாமை"; quantity = "1 கப்" },
          { name = "தண்ணீர்"; quantity = "2 கப்" },
        ];
        recipeSteps = ["சாமை நன்கு கழுவவும்", "தண்ணீரில் உதிர்த்து சமைக்கவும்"];
        calories = 220;
        healthGoal = #weight_loss;
      },
      {
        name = "சோற்றுக்கழி";
        mealType = #dinner;
        ingredients = [
          { name = "முந்திரி பருப்பு"; quantity = "50 கிராம்" },
          { name = "நறுக்கிய வெங்காயம்"; quantity = "1" },
        ];
        recipeSteps = ["முந்திரி பருப்பு வேகவைக்கவும்", "வெங்காயத்தை வைத்துக் கொள்ளவும்"];
        calories = 180;
        healthGoal = #weight_loss;
      },

      // Muscle Gain Meals
      {
        name = "கோதுமை தோசை";
        mealType = #breakfast;
        ingredients = [
          { name = "கோதுமை மாவு"; quantity = "200 கிராம்" },
          { name = "பாலை"; quantity = "250 மில்லி" },
        ];
        recipeSteps = ["கோதுமை மாவுடன்கூட பாலை சேர்த்துக் கொள்ளவும்", "தோசை அளவிற்கு உதிர்த்து வைக்கவும்"];
        calories = 300;
        healthGoal = #muscle_gain;
      },
      {
        name = "முருங்கைக்காய்";
        mealType = #lunch;
        ingredients = [
          { name = "முருங்கைக்காய் "; quantity = "5 நன்னாள்" },
          { name = "புதினா "; quantity = "10 இலைகள்" },
        ];
        recipeSteps = ["முருங்கைக்காய்களை நன்கு கழுவவும் ", "புதினாவுடன் சேர்க்கவும்"];
        calories = 250;
        healthGoal = #muscle_gain;
      },
      {
        name = "பிரோட்டீன் சளி";
        mealType = #dinner;
        ingredients = [
          { name = "மஞ்சள் பருப்பு"; quantity = "100 கிராம்" },
          { name = "கத்தரி"; quantity = "1" },
        ];
        recipeSteps = ["மஞ்சள் பருப்பு நன்கு கழுவவும்", "கத்தரியை நறுக்கவும்"];
        calories = 280;
        healthGoal = #muscle_gain;
      },

      // Balanced Meals
      {
        name = "ஆப்பம் ";
        mealType = #breakfast;
        ingredients = [
          { name = "புழுங்கல் அரிசி"; quantity = "2020 கிராம்" },
          { name = "தண்ணீர் "; quantity = "300 மில்லி" },
        ];
        recipeSteps = ["புழுங்கல் அரிசியை நன்கு கழுவவும்", "தண்ணீருடன் கலந்து கொள்ளவும்"];
        calories = 230;
        healthGoal = #balanced_diet;
      },
      {
        name = "கொத்தமல்லி சாதம்";
        mealType = #lunch;
        ingredients = [
          { name = "பச்சரிசி"; quantity = "1 கப்" },
          { name = "கொத்தமல்லி "; quantity = "100 கிராம்" },
        ];
        recipeSteps = ["பச்சரிசியை அதிகமாக கழுவவும்", "கொத்தமல்லியுடன் சேர்க்கவும்"];
        calories = 210;
        healthGoal = #balanced_diet;
      },
      {
        name = "தக்காளி ரசம்";
        mealType = #dinner;
        ingredients = [
          { name = "தக்காளி"; quantity = "3" },
          { name = "புளி "; quantity = "30 கிராம்" },
        ];
        recipeSteps = ["தக்காளிகளை நன்கு கழுவவும்", "புளியுடன் ஊற்ற வேண்டும்"];
        calories = 150;
        healthGoal = #balanced_diet;
      },
    ];
  };

  func selectRandomMeal(mealType : MealType.T, healthGoal : HealthGoal.T) : Text {
    let meals = getPredefinedMeals(healthGoal);
    let filteredMeals = meals.filter(
      func(meal) {
        meal.mealType == mealType and meal.healthGoal == healthGoal
      }
    );

    let filteredCount = filteredMeals.size();
    if (filteredCount == 0) {
      Runtime.trap("No meals found for this type and health goal");
    };

    let firstMeal = (filteredMeals.values().toArray())[0];
    firstMeal.name;
  };

  func generateWeeklyPlan(healthGoal : HealthGoal.T) : WeeklyPlan {
    {
      monday = {
        breakfast = selectRandomMeal(#breakfast, healthGoal);
        lunch = selectRandomMeal(#lunch, healthGoal);
        dinner = selectRandomMeal(#dinner, healthGoal);
      };
      tuesday = {
        breakfast = selectRandomMeal(#breakfast, healthGoal);
        lunch = selectRandomMeal(#lunch, healthGoal);
        dinner = selectRandomMeal(#dinner, healthGoal);
      };
      wednesday = {
        breakfast = selectRandomMeal(#breakfast, healthGoal);
        lunch = selectRandomMeal(#lunch, healthGoal);
        dinner = selectRandomMeal(#dinner, healthGoal);
      };
      thursday = {
        breakfast = selectRandomMeal(#breakfast, healthGoal);
        lunch = selectRandomMeal(#lunch, healthGoal);
        dinner = selectRandomMeal(#dinner, healthGoal);
      };
      friday = {
        breakfast = selectRandomMeal(#breakfast, healthGoal);
        lunch = selectRandomMeal(#lunch, healthGoal);
        dinner = selectRandomMeal(#dinner, healthGoal);
      };
      saturday = {
        breakfast = selectRandomMeal(#breakfast, healthGoal);
        lunch = selectRandomMeal(#lunch, healthGoal);
        dinner = selectRandomMeal(#dinner, healthGoal);
      };
      sunday = {
        breakfast = selectRandomMeal(#breakfast, healthGoal);
        lunch = selectRandomMeal(#lunch, healthGoal);
        dinner = selectRandomMeal(#dinner, healthGoal);
      };
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Required profile management functions per instructions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
    let mealPlan = generateWeeklyPlan(profile.healthGoal);
    userMealPlans.add(caller, mealPlan);
  };

  // Application-specific functions
  public shared ({ caller }) func setUserProfile(displayName : Text, healthGoal : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set profiles");
    };
    let goal = HealthGoal.fromText(healthGoal);
    let profile = {
      displayName;
      healthGoal = goal;
    };
    userProfiles.add(caller, profile);
    let mealPlan = generateWeeklyPlan(goal);
    userMealPlans.add(caller, mealPlan);
  };

  public query ({ caller }) func getWeeklyMealPlan() : async ?WeeklyPlan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view meal plans");
    };
    userMealPlans.get(caller);
  };

  public query ({ caller }) func getGroceryList() : async [GroceryItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view grocery lists");
    };

    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?user) { user };
    };

    let mealPlan = switch (userMealPlans.get(caller)) {
      case (null) { Runtime.trap("Meal plan not found") };
      case (?plan) { plan };
    };

    let predefinedMeals = getPredefinedMeals(profile.healthGoal);
    let allMeals = List.empty<Meal>();

    func addMealsForDay(day : DailyMeals) {
      let breakfastMeal = predefinedMeals.find(
        func(meal) { meal.name == day.breakfast }
      );
      let lunchMeal = predefinedMeals.find(
        func(meal) { meal.name == day.lunch }
      );
      let dinnerMeal = predefinedMeals.find(
        func(meal) { meal.name == day.dinner }
      );
      switch (breakfastMeal, lunchMeal, dinnerMeal) {
        case (?b, ?l, ?d) {
          allMeals.add(b);
          allMeals.add(l);
          allMeals.add(d);
        };
        case (_) {};
      };
    };

    addMealsForDay(mealPlan.monday);
    addMealsForDay(mealPlan.tuesday);
    addMealsForDay(mealPlan.wednesday);
    addMealsForDay(mealPlan.thursday);
    addMealsForDay(mealPlan.friday);
    addMealsForDay(mealPlan.saturday);
    addMealsForDay(mealPlan.sunday);

    let ingredientMap = Map.empty<Text, Text>();

    for (meal in allMeals.values()) {
      for (ingredient in meal.ingredients.values()) {
        let currentQuantity = switch (ingredientMap.get(ingredient.name)) {
          case (null) { "" };
          case (?qty) { qty };
        };
        ingredientMap.add(ingredient.name, currentQuantity # "; " # ingredient.quantity);
      };
    };

    ingredientMap.entries().toArray().map(
      func((name, totalQuantity)) {
        { name; totalQuantity };
      }
    );
  };

  public shared ({ caller }) func regenerateMealPlan() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can regenerate meal plans");
    };
    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?p) { p };
    };
    let newPlan = generateWeeklyPlan(profile.healthGoal);
    userMealPlans.add(caller, newPlan);
  };
};

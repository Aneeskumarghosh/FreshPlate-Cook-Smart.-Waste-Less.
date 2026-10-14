import { InventoryItem, Recipe, ShoppingItem, UserPreferences, ImpactMetrics, FamilyMember, ActivityFeedItem } from '../types';
import { getTodayDateString } from '../utils/helpers';

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Fresh Baby Spinach',
    emoji: '🥬',
    category: 'Fridge',
    quantity: '1 bag',
    addedDate: getTodayDateString(-4),
    expiryDate: getTodayDateString(0), // Expires Today!
  },
  {
    id: 'inv-2',
    name: 'Whole Milk',
    emoji: '🥛',
    category: 'Fridge',
    quantity: '1 carton',
    addedDate: getTodayDateString(-5),
    expiryDate: getTodayDateString(1), // 1 day left!
  },
  {
    id: 'inv-3',
    name: 'Cheddar Cheese',
    emoji: '🧀',
    category: 'Fridge',
    quantity: '200g',
    addedDate: getTodayDateString(-7),
    expiryDate: getTodayDateString(2), // 2 days left
  },
  {
    id: 'inv-4',
    name: 'Ripe Bananas',
    emoji: '🍌',
    category: 'Pantry',
    quantity: '3 pcs',
    addedDate: getTodayDateString(-3),
    expiryDate: getTodayDateString(1), // 1 day left
  },
  {
    id: 'inv-5',
    name: 'Sweet Strawberries',
    emoji: '🍓',
    category: 'Fridge',
    quantity: '1 punnet',
    addedDate: getTodayDateString(-2),
    expiryDate: getTodayDateString(2), // 2 days left
  },
  {
    id: 'inv-6',
    name: 'Roma Tomatoes',
    emoji: '🍅',
    category: 'Fridge',
    quantity: '4 pcs',
    addedDate: getTodayDateString(-3),
    expiryDate: getTodayDateString(3), // 3 days left
  },
  {
    id: 'inv-7',
    name: 'Free-Range Eggs',
    emoji: '🥚',
    category: 'Fridge',
    quantity: '6 pcs',
    addedDate: getTodayDateString(-4),
    expiryDate: getTodayDateString(5), // 5 days left
  },
  {
    id: 'inv-8',
    name: 'Fresh Basil',
    emoji: '🌿',
    category: 'Fridge',
    quantity: '1 bunch',
    addedDate: getTodayDateString(-2),
    expiryDate: getTodayDateString(2),
  },
  {
    id: 'inv-9',
    name: 'Chicken Breast',
    emoji: '🍗',
    category: 'Fridge',
    quantity: '2 fillets',
    addedDate: getTodayDateString(-1),
    expiryDate: getTodayDateString(2),
  },
  {
    id: 'inv-10',
    name: 'Fresh Broccoli',
    emoji: '🥦',
    category: 'Fridge',
    quantity: '1 head',
    addedDate: getTodayDateString(-2),
    expiryDate: getTodayDateString(4),
  },
  {
    id: 'inv-11',
    name: 'Hass Avocados',
    emoji: '🥑',
    category: 'Pantry',
    quantity: '2 pcs',
    addedDate: getTodayDateString(-2),
    expiryDate: getTodayDateString(2),
  },
  {
    id: 'inv-12',
    name: 'Sourdough Bread',
    emoji: '🍞',
    category: 'Pantry',
    quantity: '1 loaf',
    addedDate: getTodayDateString(-1),
    expiryDate: getTodayDateString(3),
  },
  {
    id: 'inv-13',
    name: 'Pasta Fusilli',
    emoji: '🍝',
    category: 'Pantry',
    quantity: '500g',
    addedDate: getTodayDateString(-15),
    expiryDate: getTodayDateString(60),
  },
  {
    id: 'inv-14',
    name: 'Garlic Bulbs',
    emoji: '🧄',
    category: 'Pantry',
    quantity: '3 heads',
    addedDate: getTodayDateString(-10),
    expiryDate: getTodayDateString(25),
  },
  {
    id: 'inv-15',
    name: 'Jasmine Rice',
    emoji: '🍚',
    category: 'Pantry',
    quantity: '1 kg',
    addedDate: getTodayDateString(-20),
    expiryDate: getTodayDateString(120),
  },
  {
    id: 'inv-16',
    name: 'Greek Yogurt',
    emoji: '🥣',
    category: 'Fridge',
    quantity: '400g',
    addedDate: getTodayDateString(-3),
    expiryDate: getTodayDateString(6),
  },
  {
    id: 'inv-17',
    name: 'Sweet Green Peas',
    emoji: '🫛',
    category: 'Freezer',
    quantity: '500g',
    addedDate: getTodayDateString(-12),
    expiryDate: getTodayDateString(90),
  },
  {
    id: 'inv-18',
    name: 'Unsalted Butter',
    emoji: '🧈',
    category: 'Fridge',
    quantity: '250g',
    addedDate: getTodayDateString(-8),
    expiryDate: getTodayDateString(18),
  },
  {
    id: 'inv-19',
    name: 'Tortillas',
    emoji: '🫓',
    category: 'Pantry',
    quantity: '6 wraps',
    addedDate: getTodayDateString(-2),
    expiryDate: getTodayDateString(5),
  },
  {
    id: 'inv-20',
    name: 'Ground Black Pepper & Spices',
    emoji: '🧂',
    category: 'Spices',
    quantity: '1 jar',
    addedDate: getTodayDateString(-30),
    expiryDate: getTodayDateString(180),
  }
];

export const RECIPES_DATABASE: Recipe[] = [
  {
    id: 'rec-1',
    name: 'Creamy Spinach Pasta',
    emoji: '🍝',
    image: '🍝',
    time: '20 min',
    timeMinutes: 20,
    difficulty: 'Easy',
    servings: 2,
    ingredients: ['spinach', 'milk', 'cheese', 'pasta', 'garlic'],
    steps: [
      'Bring a pot of salted water to a rolling boil and cook the pasta according to package instructions (about 8-10 mins).',
      'In a wide skillet, heat olive oil or butter over medium heat. Sauté minced garlic for 1 minute until fragrant.',
      'Pour in the milk and let it gently simmer for 3 minutes, reducing slightly.',
      'Fold in the fresh baby spinach until wilted, then stir in grated cheese until silky and melted.',
      'Toss the drained pasta into the creamy sauce, season with salt and pepper, and serve hot.'
    ],
    tags: ['Comfort Food', 'Vegetarian', 'Quick Dinner'],
    cuisine: 'Italian',
    isVegetarian: true,
    isHighProtein: false
  },
  {
    id: 'rec-2',
    name: 'Strawberry Banana Smoothie',
    emoji: '🍓',
    image: '🥤',
    time: '5 min',
    timeMinutes: 5,
    difficulty: 'Easy',
    servings: 1,
    ingredients: ['strawberries', 'banana', 'milk'],
    steps: [
      'Hull and rinse the fresh strawberries; peel the ripe banana and break into chunks.',
      'Place strawberries and banana into a blender jar.',
      'Pour in chilled milk (dairy or plant-based) and add 2-3 ice cubes if desired.',
      'Blend on high speed for 60 to 90 seconds until completely velvety and smooth.',
      'Pour into a tall glass and enjoy immediately.'
    ],
    tags: ['Breakfast', 'Quick', 'Kid Friendly'],
    cuisine: 'American',
    isVegetarian: true,
    isHighProtein: false
  },
  {
    id: 'rec-3',
    name: 'Veggie Omelette',
    emoji: '🍳',
    image: '🍳',
    time: '12 min',
    timeMinutes: 12,
    difficulty: 'Easy',
    servings: 1,
    ingredients: ['eggs', 'spinach', 'cheese', 'tomato'],
    steps: [
      'Whisk eggs in a bowl with a pinch of salt and cracked pepper until slightly frothy.',
      'Chop the tomato into small dice and gently rinse fresh spinach.',
      'Melt a pat of butter in a non-stick pan over medium-low heat. Sauté spinach and tomato for 1 minute.',
      'Pour whisked eggs evenly over the vegetables. Cook until edges begin to set, about 3 minutes.',
      'Scatter grated cheese over one half, fold the omelette over, and slide onto a warm plate.'
    ],
    tags: ['High Protein', 'Breakfast', 'Vegetarian'],
    cuisine: 'French',
    isVegetarian: true,
    isHighProtein: true
  },
  {
    id: 'rec-4',
    name: 'Cheese & Spinach Quesadilla',
    emoji: '🧀',
    image: '🫓',
    time: '10 min',
    timeMinutes: 10,
    difficulty: 'Easy',
    servings: 2,
    ingredients: ['cheese', 'spinach', 'tortilla'],
    steps: [
      'Warm a skillet over medium heat with a light spray of olive oil or butter.',
      'Place one tortilla flat in the skillet and distribute half of the cheese across the surface.',
      'Layer a generous handful of fresh spinach over the cheese, then top with remaining cheese.',
      'Cover with the second tortilla (or fold in half) and press gently with a spatula.',
      'Cook 2-3 minutes per side until golden brown and cheese is fully melted. Slice into triangles.'
    ],
    tags: ['Quick Snack', 'Vegetarian', '< 15 min'],
    cuisine: 'Mexican',
    isVegetarian: true,
    isHighProtein: false
  },
  {
    id: 'rec-5',
    name: 'Milk-Based Pancakes',
    emoji: '🥞',
    image: '🥞',
    time: '20 min',
    timeMinutes: 20,
    difficulty: 'Easy',
    servings: 3,
    ingredients: ['milk', 'flour', 'eggs'],
    steps: [
      'In a mixing bowl, combine 1 cup flour with a teaspoon of sugar and pinch of salt.',
      'In another bowl, whisk together the milk and eggs.',
      'Gradually stir wet ingredients into the dry flour until a smooth batter forms.',
      'Heat a lightly greased griddle over medium heat. Pour 1/4 cup batter for each pancake.',
      'Flip when bubbles appear on top (around 2 mins) and cook the other side until golden.'
    ],
    tags: ['Brunch', 'Family Favorite', 'Sweet'],
    cuisine: 'American',
    isVegetarian: true,
    isHighProtein: false
  },
  {
    id: 'rec-6',
    name: 'Tomato Basil Soup',
    emoji: '🍅',
    image: '🍲',
    time: '25 min',
    timeMinutes: 25,
    difficulty: 'Easy',
    servings: 3,
    ingredients: ['tomato', 'basil', 'garlic'],
    steps: [
      'Roughly chop fresh tomatoes and peel garlic cloves.',
      'In a saucepan, sauté garlic in 1 tbsp olive oil until aromatic but not browned.',
      'Add chopped tomatoes with a splash of water, simmer on medium-low heat for 15 minutes.',
      'Tear fresh basil leaves into the soup and season with sea salt and cracked pepper.',
      'Blend soup with an immersion blender until velvety smooth, and garnish with basil.'
    ],
    tags: ['Soup', 'Comfort Food', 'Vegetarian'],
    cuisine: 'Mediterranean',
    isVegetarian: true,
    isHighProtein: false
  },
  {
    id: 'rec-7',
    name: 'Chicken Stir-Fry',
    emoji: '🍗',
    image: '🥢',
    time: '20 min',
    timeMinutes: 20,
    difficulty: 'Medium',
    servings: 2,
    ingredients: ['chicken', 'bell pepper', 'broccoli'],
    steps: [
      'Slice chicken breast into bite-sized strips and chop broccoli into small florets.',
      'Heat 1 tbsp cooking oil in a large wok or skillet over high heat.',
      'Add sliced chicken and sear for 4-5 minutes until browned and cooked through. Remove to plate.',
      'Toss broccoli and sliced peppers into the hot pan with 2 tablespoons of water, cooking 3 mins.',
      'Return chicken to the pan, add a dash of soy sauce or seasoning, and toss vigorously for 1 min.'
    ],
    tags: ['High Protein', 'Dinner', 'Low Carb'],
    cuisine: 'Asian',
    isVegetarian: false,
    isHighProtein: true
  },
  {
    id: 'rec-8',
    name: 'Greek Yogurt Parfait',
    emoji: '🥣',
    image: '🍨',
    time: '5 min',
    timeMinutes: 5,
    difficulty: 'Easy',
    servings: 1,
    ingredients: ['yogurt', 'strawberries', 'honey'],
    steps: [
      'Wash strawberries and slice into thin coins.',
      'Spoon half of the thick Greek yogurt into a glass or dessert bowl.',
      'Layer with sliced strawberries and a drizzle of golden honey.',
      'Add the remaining yogurt layer and top with more fruit and extra honey.',
      'Sprinkle nuts or granola if available and serve fresh.'
    ],
    tags: ['High Protein', 'Breakfast', '< 15 min'],
    cuisine: 'Greek',
    isVegetarian: true,
    isHighProtein: true
  },
  {
    id: 'rec-9',
    name: 'Avocado Toast',
    emoji: '🥑',
    image: '🥪',
    time: '8 min',
    timeMinutes: 8,
    difficulty: 'Easy',
    servings: 1,
    ingredients: ['avocado', 'bread', 'egg'],
    steps: [
      'Toast your slices of sourdough bread until golden and crisp.',
      'Fry or soft-boil an egg in a small pan with a drop of oil.',
      'Cut ripe avocado in half, scoop out flesh, and mash in a bowl with lemon juice and salt.',
      'Generously spread creamy mashed avocado over the warm toast.',
      'Crown with the cooked egg, red pepper flakes, and coarse sea salt.'
    ],
    tags: ['Breakfast', 'Popular', '< 15 min'],
    cuisine: 'Cafe',
    isVegetarian: true,
    isHighProtein: true
  },
  {
    id: 'rec-10',
    name: 'Vegetable Fried Rice',
    emoji: '🍚',
    image: '🍛',
    time: '15 min',
    timeMinutes: 15,
    difficulty: 'Easy',
    servings: 2,
    ingredients: ['rice', 'carrots', 'peas', 'eggs'],
    steps: [
      'Heat oil in a large skillet. Beat eggs and scramble quickly, then set aside.',
      'In the same pan, stir-fry diced carrots and green peas for 3 minutes until tender.',
      'Add chilled cooked rice, breaking up any clumps with a wooden spoon.',
      'Drizzle with soy sauce and sesame oil, tossing everything over high heat for 2 minutes.',
      'Fold back in the scrambled eggs and serve hot with scallions.'
    ],
    tags: ['Pantry Staple', 'Vegetarian', 'Quick Dinner'],
    cuisine: 'Asian',
    isVegetarian: true,
    isHighProtein: false
  },
  {
    id: 'rec-11',
    name: 'Mushroom Risotto',
    emoji: '🍄',
    image: '🍲',
    time: '35 min',
    timeMinutes: 35,
    difficulty: 'Hard',
    servings: 3,
    ingredients: ['mushroom', 'rice', 'cheese'],
    steps: [
      'Slice mushrooms and sauté in olive oil until golden and caramelized; set aside half for garnish.',
      'In a heavy pot, toast arborio or jasmine rice with diced onion and garlic for 2 minutes.',
      'Gradually ladle warm vegetable broth or water into the rice, stirring continuously as liquid absorbs.',
      'Continue adding liquid ladle by ladle for about 18-20 minutes until rice is creamy and al dente.',
      'Fold in sautéed mushrooms, a knob of butter, and freshly grated cheese before serving.'
    ],
    tags: ['Gourmet', 'Vegetarian', 'Dinner'],
    cuisine: 'Italian',
    isVegetarian: true,
    isHighProtein: false
  },
  {
    id: 'rec-12',
    name: 'Caprese Salad',
    emoji: '🥗',
    image: '🥗',
    time: '7 min',
    timeMinutes: 7,
    difficulty: 'Easy',
    servings: 2,
    ingredients: ['tomato', 'mozzarella', 'basil'],
    steps: [
      'Slice ripe tomatoes and fresh mozzarella ball into even 1/4-inch rounds.',
      'Arrange overlapping slices of tomato and mozzarella alternatively on a serving plate.',
      'Tuck fresh sweet basil leaves between the slices.',
      'Drizzle generously with extra virgin olive oil and a dash of balsamic vinegar.',
      'Finish with flaky sea salt and freshly cracked black pepper.'
    ],
    tags: ['No Cook', 'Salad', '< 15 min', 'Vegetarian'],
    cuisine: 'Italian',
    isVegetarian: true,
    isHighProtein: false
  },
  {
    id: 'rec-13',
    name: 'Banana Bread',
    emoji: '🍌',
    image: '🍞',
    time: '50 min',
    timeMinutes: 50,
    difficulty: 'Medium',
    servings: 6,
    ingredients: ['banana', 'flour', 'eggs', 'butter'],
    steps: [
      'Preheat oven to 350°F (175°C) and grease an 8x4-inch loaf pan.',
      'In a bowl, mash very ripe bananas with a fork until smooth.',
      'Melt butter and stir into mashed bananas along with beaten eggs and sugar.',
      'Gently fold in flour and 1 tsp baking soda until just combined (do not overmix).',
      'Pour into prepared pan and bake for 45-50 minutes until a toothpick inserted comes out clean.'
    ],
    tags: ['Baking', 'Waste Free', 'Sweet Treat'],
    cuisine: 'Bakery',
    isVegetarian: true,
    isHighProtein: false
  },
  {
    id: 'rec-14',
    name: 'Egg Fried Rice',
    emoji: '🍳',
    image: '🍚',
    time: '12 min',
    timeMinutes: 12,
    difficulty: 'Easy',
    servings: 1,
    ingredients: ['eggs', 'rice', 'soy sauce', 'scallions'],
    steps: [
      'Crack eggs into a bowl and lightly beat with a pinch of salt.',
      'Heat sesame oil in a wok until shimmering; pour eggs and scramble into soft curds.',
      'Toss in day-old cooked rice, pressing with spatula to coat rice grains.',
      'Add 1-2 tbsp soy sauce around the rim of the pan for a smoky wok flavor.',
      'Toss vigorously for 90 seconds, finish with chopped scallions, and serve.'
    ],
    tags: ['Comfort Food', '< 15 min', 'High Protein'],
    cuisine: 'Asian',
    isVegetarian: true,
    isHighProtein: true
  },
  {
    id: 'rec-15',
    name: 'Broccoli Cheddar Soup',
    emoji: '🥦',
    image: '🍲',
    time: '25 min',
    timeMinutes: 25,
    difficulty: 'Medium',
    servings: 3,
    ingredients: ['broccoli', 'cheese', 'milk'],
    steps: [
      'Chop broccoli head into bite-sized florets; steam or simmer in 1 cup broth for 8 minutes.',
      'In a saucepan, melt butter and whisk with 2 tbsp flour for 1 minute to make a roux.',
      'Slowly pour in milk, whisking constantly until smooth and gently simmering.',
      'Add cooked broccoli florets and remove saucepan from direct heat.',
      'Stir in sharp cheddar cheese gradually until completely melted and rich.'
    ],
    tags: ['Soup', 'Comfort Food', 'Vegetarian'],
    cuisine: 'American',
    isVegetarian: true,
    isHighProtein: true
  },
  {
    id: 'rec-16',
    name: 'Fresh Rainbow Fruit Salad',
    emoji: '🍉',
    image: '🍓',
    time: '8 min',
    timeMinutes: 8,
    difficulty: 'Easy',
    servings: 2,
    ingredients: ['strawberries', 'banana', 'honey'],
    steps: [
      'Rinse strawberries and chop into quarters.',
      'Peel banana and slice into sweet circles.',
      'Combine all fruits in a wide glass serving bowl.',
      'Drizzle with a spoonful of honey and a squeeze of lime or orange juice.',
      'Toss gently to preserve fruit texture and serve chilled.'
    ],
    tags: ['No Cook', 'Snack', '< 15 min', 'Vegetarian'],
    cuisine: 'Healthy',
    isVegetarian: true,
    isHighProtein: false
  },
  {
    id: 'rec-17',
    name: 'Pasta Primavera',
    emoji: '🍝',
    image: '🥗',
    time: '22 min',
    timeMinutes: 22,
    difficulty: 'Easy',
    servings: 2,
    ingredients: ['pasta', 'vegetables', 'cheese', 'garlic'],
    steps: [
      'Boil pasta in salted water until al dente, reserving 1/2 cup pasta cooking water.',
      'Sauté minced garlic in extra virgin olive oil for 1 minute.',
      'Add mixed seasonal vegetables (broccoli, peas, carrots) and sauté until crisp-tender.',
      'Toss drained pasta into vegetables with a splash of pasta water.',
      'Shower with grated parmesan cheese and fresh herbs, tossing until glossy.'
    ],
    tags: ['Vegetarian', 'Quick Dinner', 'Healthy'],
    cuisine: 'Italian',
    isVegetarian: true,
    isHighProtein: false
  },
  {
    id: 'rec-18',
    name: 'Gourmet Grilled Cheese',
    emoji: '🧀',
    image: '🥪',
    time: '10 min',
    timeMinutes: 10,
    difficulty: 'Easy',
    servings: 1,
    ingredients: ['cheese', 'bread', 'butter'],
    steps: [
      'Generously butter one side of each slice of artisan sourdough bread.',
      'Place one bread slice butter-side down in a medium skillet over medium heat.',
      'Pile thick slices of cheddar and mozzarella onto the bread.',
      'Top with second bread slice, butter-side facing upward.',
      'Cook for 3-4 minutes per side until deeply golden and cheese is molten and stretchy.'
    ],
    tags: ['Quick Snack', '< 15 min', 'Comfort Food'],
    cuisine: 'American',
    isVegetarian: true,
    isHighProtein: false
  },
  {
    id: 'rec-19',
    name: 'Crispy Potato Hash',
    emoji: '🥔',
    image: '🍳',
    time: '22 min',
    timeMinutes: 22,
    difficulty: 'Medium',
    servings: 2,
    ingredients: ['potato', 'onion', 'eggs'],
    steps: [
      'Peel potatoes and cut into small 1/2-inch dice; parboil for 4 minutes or microwave 2 mins.',
      'Heat 2 tbsp oil in a cast iron skillet over medium-high heat.',
      'Add diced onion and par-cooked potatoes; press down flat with spatula.',
      'Cook undisturbed for 5 minutes until crispy underneath, then flip and brown other side.',
      'Make two wells in the hash, crack in eggs, cover skillet for 3 mins until eggs set.'
    ],
    tags: ['High Protein', 'Breakfast', 'Comfort Food'],
    cuisine: 'Diner',
    isVegetarian: true,
    isHighProtein: true
  },
  {
    id: 'rec-20',
    name: 'Superfood Smoothie Bowl',
    emoji: '🫐',
    image: '🥣',
    time: '10 min',
    timeMinutes: 10,
    difficulty: 'Easy',
    servings: 1,
    ingredients: ['banana', 'strawberries', 'yogurt'],
    steps: [
      'Place frozen banana slices, strawberries, and thick yogurt into a blender.',
      'Blend on low using a tamper until ultra-thick like soft-serve ice cream.',
      'Scoop thick mixture into a wide breakfast bowl.',
      'Artfully arrange toppings: sliced bananas, fresh berries, chia seeds, and coconut.',
      'Drizzle with honey or almond butter and enjoy with a spoon.'
    ],
    tags: ['Breakfast', '< 15 min', 'Aesthetic'],
    cuisine: 'Modern',
    isVegetarian: true,
    isHighProtein: true
  },
  {
    id: 'rec-21',
    name: 'Chicken Caesar Salad',
    emoji: '🥗',
    image: '🍗',
    time: '18 min',
    timeMinutes: 18,
    difficulty: 'Easy',
    servings: 2,
    ingredients: ['chicken', 'lettuce', 'cheese', 'croutons'],
    steps: [
      'Season chicken breast with garlic powder, salt, and pepper; grill in pan for 5 mins each side.',
      'Wash crisp romaine lettuce and chop into bite-sized pieces.',
      'Slice cooked chicken breast against the grain into tender strips.',
      'Toss lettuce in a bowl with creamy Caesar dressing and crunchy croutons.',
      'Top with warm chicken strips and a shower of shaved parmesan cheese.'
    ],
    tags: ['High Protein', 'Dinner', 'Salad'],
    cuisine: 'American',
    isVegetarian: false,
    isHighProtein: true
  },
  {
    id: 'rec-22',
    name: 'Hearty Lentil Soup',
    emoji: '🍲',
    image: '🥣',
    time: '35 min',
    timeMinutes: 35,
    difficulty: 'Easy',
    servings: 4,
    ingredients: ['lentils', 'carrots', 'celery', 'onion'],
    steps: [
      'Finely dice onion, carrots, and celery ribs (mirepoix base).',
      'Heat olive oil in a Dutch oven and sauté vegetables for 6 minutes until sweet.',
      'Rinse brown or green lentils and add to the pot along with 4 cups vegetable broth.',
      'Simmer on low heat with lid slightly ajar for 25-30 minutes until lentils are tender.',
      'Season with cumin, lemon juice, and chopped parsley before ladling into bowls.'
    ],
    tags: ['Vegetarian', 'High Protein', 'Meal Prep'],
    cuisine: 'Mediterranean',
    isVegetarian: true,
    isHighProtein: true
  },
  {
    id: 'rec-23',
    name: 'Garlic Tomato Zucchini Noodles',
    emoji: '🥒',
    image: '🍝',
    time: '12 min',
    timeMinutes: 12,
    difficulty: 'Easy',
    servings: 1,
    ingredients: ['zucchini', 'garlic', 'tomato'],
    steps: [
      'Spiralize fresh zucchini into noodle strands (zoodles) or shave with a peeler.',
      'Slice cherry tomatoes in half and mince garlic cloves.',
      'Heat olive oil in a skillet over medium heat; sauté garlic and tomatoes for 3 minutes.',
      'Add zucchini noodles and flash cook for just 90 seconds (keep them crunchy, not soggy).',
      'Season with flaky salt, black pepper, and fresh torn basil leaves.'
    ],
    tags: ['Low Carb', '< 15 min', 'Vegetarian'],
    cuisine: 'Italian',
    isVegetarian: true,
    isHighProtein: false
  },
  {
    id: 'rec-24',
    name: 'Classic French Cheese Omelette',
    emoji: '🍳',
    image: '🧀',
    time: '8 min',
    timeMinutes: 8,
    difficulty: 'Easy',
    servings: 1,
    ingredients: ['eggs', 'cheese', 'butter'],
    steps: [
      'Vigorously beat 3 eggs with a pinch of salt until completely uniform with no whites showing.',
      'Melt 1 tbsp butter in an 8-inch non-stick skillet over medium-low heat.',
      'Pour eggs in and rapidly swirl the pan in circles while shaking until small soft curds form.',
      'Sprinkle shredded cheese in a neat line down the center.',
      'Roll the omelette into a cylinder shape and tip onto a plate seam-side down.'
    ],
    tags: ['High Protein', '< 15 min', 'French Classic'],
    cuisine: 'French',
    isVegetarian: true,
    isHighProtein: true
  },
  {
    id: 'rec-25',
    name: 'Velvety Milk Tea Latte',
    emoji: '🧋',
    image: '☕',
    time: '8 min',
    timeMinutes: 8,
    difficulty: 'Easy',
    servings: 1,
    ingredients: ['milk', 'tea', 'sugar'],
    steps: [
      'In a small saucepan, bring 1/2 cup water to a boil with 2 black tea bags (English Breakfast or Earl Grey).',
      'Simmer for 3 minutes to extract deep tea flavors.',
      'Add 1/2 cup milk and 1 teaspoon sugar or honey.',
      'Warm gently on low heat until steaming and fragrant (do not boil milk over).',
      'Strain into your favorite mug, sprinkle cinnamon on top, and sip cozy.'
    ],
    tags: ['Cozy Drink', '< 15 min', 'Quick'],
    cuisine: 'Cafe',
    isVegetarian: true,
    isHighProtein: false
  }
];

export const INITIAL_SHOPPING_LIST: ShoppingItem[] = [
  { id: 'shop-1', name: 'Fresh Mozzarella Ball', category: 'Dairy', checked: false, note: 'For Caprese salad', emoji: '🧀' },
  { id: 'shop-2', name: 'Artisan Sourdough Loaf', category: 'Bakery', checked: false, note: 'For breakfast toast', emoji: '🍞' },
  { id: 'shop-3', name: 'Rolled Oats', category: 'Pantry', checked: true, note: 'Breakfast pantry refill', emoji: '🥣' },
  { id: 'shop-4', name: 'Honey / Maple Syrup', category: 'Pantry', checked: false, note: 'Smoothie bowl sweetener', emoji: '🍯' },
  { id: 'shop-5', name: 'Crisp Romaine Lettuce', category: 'Produce', checked: false, note: 'For Chicken Caesar', emoji: '🥬' },
  { id: 'shop-6', name: 'Olive Oil Extra Virgin', category: 'Pantry', checked: true, note: 'Daily cooking essential', emoji: '🫒' },
];

export const INITIAL_PREFERENCES: UserPreferences = {
  name: 'Carlos',
  email: 'carlos.m@freshplate.app',
  householdSize: 3,
  dietaryRestrictions: ['Vegetarian Friendly'],
  cookingTime: 'Under 30 min',
  notifications: {
    expiryAlerts: true,
    weeklyPlan: true,
    monthlyReport: false
  },
  streak: 12,
  joinedDate: 'September 2026'
};

export const INITIAL_IMPACT: ImpactMetrics = {
  moneySaved: 148,
  foodSaved: 8.6,
  co2Avoided: 24.2,
  waterSaved: 940,
  wasteStreak: 12
};

export const FAMILY_MEMBERS: FamilyMember[] = [
  { id: 'fam-1', name: 'Carlos', role: 'Kitchen Captain (You)', initials: 'C', bgColor: 'bg-emerald-600 text-white', isCurrentUser: true },
  { id: 'fam-2', name: 'Maria', role: 'Meal Planner', initials: 'M', bgColor: 'bg-amber-500 text-white' },
  { id: 'fam-3', name: 'Leo', role: 'Master Taster', initials: 'L', bgColor: 'bg-blue-500 text-white' },
  { id: 'fam-4', name: 'Sofia', role: 'Snack Scout', initials: 'S', bgColor: 'bg-rose-500 text-white' }
];

export const MOCK_ACTIVITY_FEED: ActivityFeedItem[] = [
  { id: 'act-1', userName: 'Maria', action: 'added to Fridge', detail: 'Fresh Strawberries (1 punnet)', timeAgo: '2 hours ago', emoji: '🍓' },
  { id: 'act-2', userName: 'Carlos', action: 'cooked', detail: 'Creamy Spinach Pasta (saved $8)', timeAgo: 'Yesterday at 7:30 PM', emoji: '🍝' },
  { id: 'act-3', userName: 'Leo', action: 'checked off shopping list', detail: 'Free-Range Eggs', timeAgo: '2 days ago', emoji: '🥚' },
  { id: 'act-4', userName: 'Carlos', action: 'rescued from waste', detail: '3 Ripe Bananas made into Banana Bread', timeAgo: '3 days ago', emoji: '🍌' }
];

<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
<br><br>
    <button @click="randomizeIngredients">I'm Feeling Lucky</button>
    <br><br>
    <h2>Select your potion ingredients!</h2>
    <br>
    <select v-if="ingredientsData" v-model="selectedIngredient1">
      <option v-for="ingredient in ingredientsData.ingredients" :key="ingredient.name" :value="ingredient.name">
        {{ ingredient.name }}
      </option>
    </select>
    <br>
    <select v-if="ingredientsData" v-model="selectedIngredient2">
      <option v-for="ingredient in ingredientsData.ingredients" :key="ingredient.name" :value="ingredient.name">
        {{ ingredient.name }}
      </option>
    </select>
    <br>
    <select v-if="ingredientsData" v-model="selectedIngredient3">
      <option v-for="ingredient in ingredientsData.ingredients" :key="ingredient.name" :value="ingredient.name">
        {{ ingredient.name }}
      </option>
    </select>
    <br>
    <br>
    <button @click="generatePotion">Generate Potion</button>
    <br>

    <!-- Output the potion if it has been generated -->
    <div v-if="potion.length">
      <br>
      <h2>Potion Ingredients</h2>
        <p v-for="(ingredient, index) in potion" :key="index">{{ ingredient }}</p>

      <h2>Potion Effects</h2>
        <p v-for="(effect, index) in potionEffects" :key="index">{{ effect }}</p>
    </div>

  </div>
</template>

<script>
import ingredients from '../assets/ingredients.json';

export default {
  name: 'FablesAlchemy',
  props: {
    msg: String
  },
  data() {
    return {
      ingredientsData: ingredients,
      potion: [],
      potionEffects: [],
      selectedIngredient1: null,
      selectedIngredient2: null,
      selectedIngredient3: null,
    };
  },
  methods: {
    async fetchData() {
      try {
        const response = await fetch("../assets/ingredients.json");
        this.ingredientsData = await response.json();
      } catch (error) {
        console.error('Failed to fetch ingredient data:', error);
      }
    },

    addIngredient(ingredientName) {
      let ingredient = this.ingredientsData.ingredients.find(ingredient => ingredient.name === ingredientName);

      if (!ingredient) {
        console.error('Unknown ingredient:', ingredientName);
        return;
      }

      // Count how many times this ingredient has been used in the potion
      let count = this.potion.filter(name => name === ingredientName).length;

      if (count >= ingredient.effects.length) {
        console.error('Ingredient used too many times:', ingredientName);
        return;
      }

      // Remove any existing effects of this ingredient
      this.potionEffects = this.potionEffects.filter(effect => !ingredient.effects.includes(effect));

      // Add the corresponding effect to the potion effects
      this.potionEffects.push(ingredient.effects[count]);

      // Add the ingredient to the potion
      this.potion.push(ingredientName);
    },

    generatePotion() {
      // Reset potion and potionEffects before generating a new one
      this.potion = [];
      this.potionEffects = [];

      // Check that all three ingredients are selected
      if (!this.selectedIngredient1 || !this.selectedIngredient2 || !this.selectedIngredient3) {
        alert('Please select all three ingredients before generating a potion');
        return;
      }

      this.addIngredient(this.selectedIngredient1);
      this.addIngredient(this.selectedIngredient2);
      this.addIngredient(this.selectedIngredient3);
    },

    randomizeIngredients() {
      let ingredientNames = this.ingredientsData.ingredients.map(ingredient => ingredient.name);

      // Select three ingredients independently
      this.selectedIngredient1 = this.getRandomIngredient(ingredientNames);
      this.selectedIngredient2 = this.getRandomIngredient(ingredientNames);
      this.selectedIngredient3 = this.getRandomIngredient(ingredientNames);

      // Generate a potion with the randomized ingredients
      this.generatePotion();
    },

    // Function to randomly select an ingredient
    getRandomIngredient(ingredients) {
      let randomIndex = Math.floor(Math.random() * ingredients.length);
      return ingredients[randomIndex];
    },

    // Function to shuffle an array (Fisher-Yates algorithm)
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // swap elements
      }
      return array;
    }

  },
  async created() {
    await this.fetchData();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

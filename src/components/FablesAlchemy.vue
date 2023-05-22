<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

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
    <button @click="randomizeIngredients">Randomize Ingredients</button>
    <br>
    <br>
    <button @click="generatePotion">Generate Potion</button>

    <!-- Output the potion if it has been generated -->
    <div v-if="potion.length">
      <h2>Potion Ingredients:</h2>
      <ul>
        <li v-for="(ingredient, index) in potion" :key="index">{{ ingredient }}</li>
      </ul>

      <h2>Potion Effects:</h2>
      <ul>
        <li v-for="(effect, index) in potionEffects" :key="index">{{ effect }}</li>
      </ul>
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
      // Clear the current potion and effects
      this.potion = [];
      this.potionEffects = [];

      // Add each selected ingredient to the potion
      if (this.selectedIngredient1) this.addIngredient(this.selectedIngredient1);
      if (this.selectedIngredient2) this.addIngredient(this.selectedIngredient2);
      if (this.selectedIngredient3) this.addIngredient(this.selectedIngredient3);
    },
    randomizeIngredients() {
      let ingredientNames = this.ingredientsData.ingredients.map(ingredient => ingredient.name);
      let shuffledNames = this.shuffleArray(ingredientNames);

      // Select the first three ingredients
      this.selectedIngredient1 = shuffledNames[0];
      this.selectedIngredient2 = shuffledNames[1];
      this.selectedIngredient3 = shuffledNames[2];
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

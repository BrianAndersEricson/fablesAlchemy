<template>
  <div>
    <p>
      This potion is {{ flavorProfileResult.rating }} {{flavorProfileResult.conjunction}}
      {{ flavorProfileResult.dominantFlavor }}.
    </p>
  </div>
</template>

<script>
import ingredients from "../assets/ingredients.json";

export default {
  name: "PotionFlavorProfile",
  // Define a prop for the component to receive the potion ingredients
  props: {
    potion: Array,
  },
  data() {
    return {
      // Load ingredients data from a json file
      ingredients: ingredients.ingredients,
      // Define flavor ratings
      flavorRatings: ["terrible", "awful", "palatable", "decent", "delicious"],
      // Define flavor profiles
      flavorProfiles: {
        umami: ["flavorful", "savory", "rich", "salty", "briny"],
        heat: ["zingy", "spicy", "hot", "burning", "scorching"],
        sweet: ["sweet", "sugary", "saccarine", "cloying"],
        bitter: ["dry", "tannic", "sharp", "acrid", "stringent"],
        sour: ["tangy", "tart", "biting", "acidic", "acerbic"],
      },
      // Initialize taste of the potion
      potionTaste: { bitter: 0, sour: 0, heat: 0, sweet: 0, umami: 0 },
      // Initialize the final flavor profile result
      flavorProfileResult: {},
    };
  },
  methods: {
    // A method that balances two flavors
    balanceFlavors(flavor1, flavor2) {
      let balance = this.potionTaste[flavor1] - this.potionTaste[flavor2];
      if(balance > 0) {
        this.potionTaste[flavor1] = balance;
        this.potionTaste[flavor2] = 0;
      } else {
        this.potionTaste[flavor2] = Math.abs(balance);
        this.potionTaste[flavor1] = 0;
      }
    },
// A method that refreshes the flavor profile of the potion
    refreshFlavorProfile() {
      // Check if all tastes are 0
      const isPlain = Object.values(this.potionTaste).every(value => value === 0);

      if (isPlain) {
        // If all tastes are 0, set the rating to 'plain' and the dominant flavor to 'balanced'
        this.flavorProfileResult = {
          rating: 'plain',
          dominantFlavor: 'balanced',
          conjunction: 'and'
        };
      } else {
        const balance = this.calculateFlavorBalance();
        const dominantFlavor = this.findDominantFlavor();

        // Calculate flavor profile index based on the taste intensity
        let flavorProfileIndex = Math.floor(this.potionTaste[dominantFlavor] / 5);

        // Ensure the index stays within the bounds of the flavorProfiles array
        flavorProfileIndex = Math.min(flavorProfileIndex, this.flavorProfiles[dominantFlavor].length - 1);

        this.flavorProfileResult = {
          rating: this.flavorRatings[balance],
          dominantFlavor: this.flavorProfiles[dominantFlavor][flavorProfileIndex],
          conjunction: balance <= 1 ? 'but' : 'and'
        };
      }
    },
    // A method that calculates the flavor balance of the potion
    calculateFlavorBalance() {
      this.balanceFlavors("umami", "bitter");
      this.balanceFlavors("heat", "sweet");
      this.balanceFlavors("bitter", "sweet");
      this.balanceFlavors("sour", "sweet");

      if(this.potionTaste.sour > this.potionTaste.bitter) this.potionTaste.bitter = 0;
      if(this.potionTaste.sour > this.potionTaste.heat) this.potionTaste.heat = 0;

      let balancedFlavors = 0;
      let flavors = ["bitter", "sour", "heat", "sweet", "umami"];
      for(let flavor of flavors){
        if(this.potionTaste[flavor] > 0) balancedFlavors++;
      }

      return balancedFlavors;
    },
    // A method that finds the dominant flavor of the potion
    findDominantFlavor() {
      return Object.keys(this.potionTaste).reduce((a, b) =>
          this.potionTaste[a] > this.potionTaste[b] ? a : b
      );
    },
    // A method that combines the taste of all ingredients in the potion
    combineIngredientsTaste() {
      if (!this.potion || !Array.isArray(this.potion)) {
        return;
      }
      this.potionTaste = { bitter: 0, sour: 0, heat: 0, sweet: 0, umami: 0 };
      for (const ingredientName of this.potion) {
        const ingredient = this.ingredients.find((i) => i.name === ingredientName);
        if (ingredient) {
          this.potionTaste.bitter += ingredient.taste[0];
          this.potionTaste.sour += ingredient.taste[1];
          this.potionTaste.heat += ingredient.taste[2];
          this.potionTaste.sweet += ingredient.taste[3];
          this.potionTaste.umami += ingredient.taste[4];
        }
      }

      if(this.potionTaste.sour > 0 && this.potionTaste.umami > 0) this.potionTaste.umami++;
      if(this.potionTaste.sweet > 0 && this.potionTaste.umami > 0) this.potionTaste.umami++;
    },
  },
  // When the component is created, combine the ingredients' taste
  created() {
    this.combineIngredientsTaste();
  },
  // Watch for changes to the potion prop
  watch: {
    potion: {
      immediate: true,
      handler() {
        this.combineIngredientsTaste();
        this.refreshFlavorProfile();
      },
    },
  },
};
</script>

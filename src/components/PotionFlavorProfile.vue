<template>
  <div>
    <p>
      This potion tastes {{ flavorProfileResult.rating }} with a
      {{ flavorProfileResult.dominantFlavor }} flavor profile.
    </p>
  </div>
</template>

<script>
import ingredients from "../assets/ingredients.json";

export default {
  name: "PotionFlavorProfile",
  props: {
    potion: Array,
  },
  data() {
    return {
      ingredients: ingredients.ingredients,
      flavorRatings: [
        "Terrible",
        "Awful",
        "Palatable",
        "Decent",
        "Tasty",
        "Delicious",
      ],
      flavorProfiles: {
        umami: ["Tasty", "Saline", "Briny"],
        spicy: ["Hot", "Burning", "Scorching"],
        sweet: ["Sugary", "Saccharine", "Cloying"],
        bitter: ["Dry", "Sharp", "Harsh"],
        sour: ["Tangy", "Tart", "Acerbic"],
      },
      potionTaste: { bitter: 0, sour: 0, spicy: 0, sweet: 0, umami: 0 },
      flavorProfileResult: {}
    };
  },
  methods: {
    refreshFlavorProfile() {
      const balance = this.calculateFlavorBalance();
      const dominantFlavor = this.findDominantFlavor();
      this.flavorProfileResult = {
        rating: this.flavorRatings[balance],
        dominantFlavor: this.flavorProfiles[dominantFlavor][0],
      };
    },
    calculateFlavorBalance() {
      let balancedFlavors = 0;

      if (
        this.potionTaste.bitter >
        Math.max(this.potionTaste.umami, this.potionTaste.sweet)
      )
        balancedFlavors++;

      if (this.potionTaste.umami > this.potionTaste.bitter) balancedFlavors++;

      if (this.potionTaste.sour > this.potionTaste.sweet) balancedFlavors++;

      if (
        this.potionTaste.spicy >
        Math.max(this.potionTaste.sweet, this.potionTaste.sour)
      )
        balancedFlavors++;

      if (
        this.potionTaste.sweet >
        Math.max(
          this.potionTaste.spicy,
          this.potionTaste.bitter,
          this.potionTaste.sour
        )
      )
        balancedFlavors++;

      // Handle Flavor enhancing
      if (this.potionTaste.sour > 0 && this.potionTaste.umami > 0)
        this.potionTaste.umami++;
      if (this.potionTaste.sweet > 0 && this.potionTaste.umami > 0)
        this.potionTaste.umami++;

      return balancedFlavors;
    },
    findDominantFlavor() {
      return Object.keys(this.potionTaste).reduce((a, b) =>
        this.potionTaste[a] > this.potionTaste[b] ? a : b
      );
    },
    combineIngredientsTaste() {
      if (!this.potion || !Array.isArray(this.potion)) {
        return;
      }
      for (const ingredientName of this.potion) {
        const ingredient = this.ingredients.find(
          (i) => i.name === ingredientName
        );
        if (ingredient) {
          console.log(ingredient.taste)
          this.potionTaste.bitter += ingredient.taste[0];
          this.potionTaste.sour += ingredient.taste[1];
          this.potionTaste.spicy += ingredient.taste[2];
          this.potionTaste.sweet += ingredient.taste[3];
          this.potionTaste.umami += ingredient.taste[4];
        }
      }
    },
  },
  created() {
    this.combineIngredientsTaste();
  },
  updated() {
    this.refreshFlavorProfile();
  }
};
</script>

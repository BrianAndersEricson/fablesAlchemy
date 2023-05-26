<template>
  <div>
    <p>
      This potion is {{ flavorProfileResult.rating }}
      {{ flavorProfileResult.conjunction }} has
      {{ flavorProfileResult.dominantFlavor }} overtones.
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
        "horrendous",
        "awful",
        "terrible",
        "rancid",
        "disgusting",
        "nauseating",
        "repulsive",
        "vile",
        "foul",
        "off-putting",
        "unappetizing",
        "tastelss",
        "palatable",
        "mediocre",
        "ordinary",
        "unremarkable",
        "edible",
        "decent",
        "pleasant",
        "appetizing",
        "enjoyable",
        "tasty",
        "delicious",
        "exquisite",
        "scrumptious",
        "mouthwatering",
        "marvelous",
        "sublime",
      ],
      flavorProfiles: {
        umami: ["flavorful", "savory", "rich", "salty", "briny"],
        heat: ["zingy", "spicy", "hot", "burning", "scorching"],
        sweet: ["sweet", "sugary", "saccarine", "cloying"],
        bitter: ["dry", "tannic", "sharp", "acrid", "stringent"],
        sour: ["tangy", "tart", "biting", "acidic", "acerbic"],
      },
      potionTaste: { bitter: 0, sour: 0, heat: 0, sweet: 0, umami: 0 },
      potionPalatability: 0,
      flavorProfileResult: {},
    };
  },
  methods: {
    balanceFlavors(flavor1, flavor2) {
      let balance = this.potionTaste[flavor1] - this.potionTaste[flavor2];
      if (balance > 0) {
        this.potionTaste[flavor1] = balance;
        this.potionTaste[flavor2] = 0;
      } else {
        this.potionTaste[flavor2] = Math.abs(balance);
        this.potionTaste[flavor1] = 0;
      }
    },
    mapInputToArrayIndex(input, arrayLength = 30) {
      // Get the actual minimum and maximum palatability values
      const minPalatability = Math.min(...this.ingredients.map(i => i.palatability));
      const maxPalatability = Math.max(...this.ingredients.map(i => i.palatability));

      // Scale the input to a number between 0 and arrayLength
      let scaledInput = ((input - minPalatability) / (maxPalatability - minPalatability)) * arrayLength;

      // Ensure the index stays within the bounds of the array
      return Math.min(Math.max(Math.floor(scaledInput), 0), arrayLength - 1);
    },
    refreshFlavorProfile() {
      const isPlain = Object.values(this.potionTaste).every(
        (value) => value === 0
      );

      if (isPlain) {
        this.flavorProfileResult = {
          rating: "plain",
          dominantFlavor: "balanced",
          conjunction: "and",
        };
      } else {
        const balance = this.calculateFlavorBalance();
        const dominantFlavor = this.findDominantFlavor();

        let flavorProfileIndex = Math.floor(
          this.potionTaste[dominantFlavor] / 5
        );

        flavorProfileIndex = Math.min(
          flavorProfileIndex,
          this.flavorProfiles[dominantFlavor].length - 1
        );

        let flavorRatingIndex = this.mapInputToArrayIndex(
          this.potionPalatability
        );

        flavorRatingIndex = Math.min(
          flavorRatingIndex,
          this.flavorRatings.length - 1
        );

        this.flavorProfileResult = {
          rating: this.flavorRatings[flavorRatingIndex],
          dominantFlavor:
            this.flavorProfiles[dominantFlavor][flavorProfileIndex],
          conjunction: balance <= 1 ? "but" : "and",
        };
      }
    },
    calculateFlavorBalance() {
      this.balanceFlavors("umami", "bitter");
      this.balanceFlavors("heat", "sweet");
      this.balanceFlavors("bitter", "sweet");
      this.balanceFlavors("sour", "sweet");

      if (this.potionTaste.sour > this.potionTaste.bitter)
        this.potionTaste.bitter = 0;
      if (this.potionTaste.sour > this.potionTaste.heat)
        this.potionTaste.heat = 0;

      let balancedFlavors = 0;
      let flavors = ["bitter", "sour", "heat", "sweet", "umami"];
      for (let flavor of flavors) {
        if (this.potionTaste[flavor] > 0) balancedFlavors++;
      }

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
      this.potionTaste = { bitter: 0, sour: 0, heat: 0, sweet: 0, umami: 0 };
      this.potionPalatability = 0; // Initialize palatability

      for (const ingredientName of this.potion) {
        const ingredient = this.ingredients.find(
          (i) => i.name === ingredientName
        );
        if (ingredient) {
          this.potionTaste.bitter += ingredient.taste[0];
          this.potionTaste.sour += ingredient.taste[1];
          this.potionTaste.heat += ingredient.taste[2];
          this.potionTaste.sweet += ingredient.taste[3];
          this.potionTaste.umami += ingredient.taste[4];
          this.potionPalatability += ingredient.palatability; // Add ingredient's palatability
        }
      }

      if (this.potionTaste.sour > 0 && this.potionTaste.umami > 0)
        this.potionTaste.umami++;
      if (this.potionTaste.sweet > 0 && this.potionTaste.umami > 0)
        this.potionTaste.umami++;
    },
  },
  created() {
    this.combineIngredientsTaste();
  },
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
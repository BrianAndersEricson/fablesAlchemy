<template>
  <div class="potion-visualization">
    <div
      v-if="potion.length"
      class="potion-color"
      :style="{ backgroundColor: potionColor }"
    ></div>
  </div>
</template>

<script>
import ingredients from "../assets/ingredients.json";

export default {
  name: "PotionVisualization",
  props: ["potion", "ingredients"],
  computed: {
    potionColor() {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let totalDensity = 0;

      for (const ingredientName of this.potion) {
        const ingredient = ingredients.ingredients.find(
          (i) => i.name === ingredientName
        );

        if (ingredient) {
          r += ingredient.color[0] * ingredient.density;
          g += ingredient.color[1] * ingredient.density;
          b += ingredient.color[2] * ingredient.density;
          a += ingredient.color[3] * ingredient.density;
          totalDensity += ingredient.density;
        }
      }

      // Divide by totalDensity to average the color
      r = Math.round(r / totalDensity);
      g = Math.round(g / totalDensity);
      b = Math.round(b / totalDensity);
      a = a / totalDensity;

      // Clamp values just in case
      r = Math.min(Math.max(r, 0), 255);
      g = Math.min(Math.max(g, 0), 255);
      b = Math.min(Math.max(b, 0), 255);
      a = Math.min(Math.max(a, 0), 1);

      return `rgba(${r}, ${g}, ${b}, ${a})`;
    },
  },
};
</script>

<style scoped>
.potion-visualization {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.potion-color {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  border: 2px black;
}
</style>

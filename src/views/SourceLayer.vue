<template>
  <div class="sourceLayer">
    <MHeader />
    <CesiumMap />
  </div>
</template>

<script>
import MHeader from "@/components/Widget/MHeader";
import CesiumMap from "@/components/SourceLayer/cesium_map";

export default {
  components: {
    MHeader,
    CesiumMap,
  },
};
</script>

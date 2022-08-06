<template>
  <div id="mapContainer">
    <div id="map"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src = "http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=24d9dd2b194405efa51234ce18bad7dc";
      document.head.appendChild(script);
    }
  },
  methods: {
    initMap() {
      var mapContainer = document.getElementById("map"), // 지도를 표시할 div
        mapOption = {
          center: new kakao.maps.LatLng(37.564343, 126.947613), // 지도의 중심좌표
          level: 3, // 지도의 확대 레벨
        };

      var map = new kakao.maps.Map(mapContainer, mapOption);
      var positions = [
        {
          latlng: new kakao.maps.LatLng(37.562632898194835, 126.9454282268269),
        },
        {
          latlng: new kakao.maps.LatLng(37.562632898194835, 126.9454282268269),
        },
      ];

      // Create Maker
      positions.forEach((pos) => {
        var marker = new kakao.map.Marker({
          postion: pos.latlng,
        });
        // 마커가 지도위에 표시 되도록 설정
        marker.setMap(map);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~/scss/main.scss";
#mapContainer {
  @include center;
  width: 100%;
  height: 35%;
  #map {
    width: 80%;
    height: 90%;
    border-radius: 10px;
  }
}
</style>

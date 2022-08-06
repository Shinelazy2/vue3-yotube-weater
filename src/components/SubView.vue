<template>
  <div class="rightContainer">
    <div id="cityNameBox">
      <div class="cityName">
        <p>{{ cityName }}</p>
        <p>{{ currentTime }}</p>
      </div>
    </div>
    <div id="contentsBox">
      <div class="buttonBox">
        <div class="buttonBackground">
          <button class="forecast">Forecast</button>
          <button class="airquality">Airquality</button>
        </div>
      </div>
      <div class="weatherBox">
        <div class="airCondition">
          <p>{{ feeling }}</p>
        </div>
        <div class="detail">
          <div class="title">
            <p>상세 날씨 데이터</p>
          </div>
          <div class="data" v-for="(detailData, index) in subWeatherData" :key="index">
            <div class="dataName">
              <p></p>
              <p>{{ detailData.name }}</p>
            </div>
            <div class="dataValue">
              <p>{{ detailData.value }}<span></span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Map />
    <nav>
      <i class="fas fa-home"></i>
      <i class="fas fa-search-location"></i>
      <i class="fas fa-chart-line"></i>
      <i class="fas fa-cog"></i>
    </nav>
  </div>
</template>

<script>
import Map from "./Map.vue";
import { ref } from "vue";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import axios from "axios";
dayjs.locale("ko");

export default {
  components: { Map },
  setup() {
    let currentTime = dayjs().format("YYYY. MM. DD. ddd");
    let cityName = ref("");
    let feeling = ref("");
    let subWeatherData = ref("");

    const Unix_timestamp = (dt) => {
      let date = new Date(dt * 1000);
      let hour = "0" + date.getHours();
      return hour.substr(-2) + "시";
    };

    const fetchOpenWeather = async () => {
      const API_KEY = "e7878598157a92ae89d1403b94d8653d";
      let initialLat = 36.5683;
      let initialLon = 126.96778;

      try {
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${initialLat}&lon=${initialLon}&appid=${API_KEY}&units=metric`);
        console.log("res");
        console.log(res);

        let isInitialData = res.data.current;
        let isInitialCityName = res.data.timezone;

        let isFeelLikeTemp = isInitialData.feels_like;
        let isTimeOfSunrise = isInitialData.sunrise;
        let isTimeOfSunset = isInitialData.sunset;
        let isLimeOfSight = isInitialData.visibility;

        //isFeelLikeTemp > 30 ? (feeling.value = "매우 더움") : "";
        //isFeelLikeTemp <= 30 ? (feeling.value = "더움") : "";
        //isFeelLikeTemp <= 25 ? (feeling.value = "보통") : "";
        //isFeelLikeTemp <= 20 ? (feeling.value = "신선함") : "";
        //isFeelLikeTemp <= 15 ? (feeling.value = "쌀쌀함") : "";
        //isFeelLikeTemp <= 10 ? (feeling.value = "추움") : "";
        //isFeelLikeTemp <= 0 ? (feeling.value = "매우 추움") : "";

        const tempPoints = [30, 25, 20, 15, 10, 0];
        const lavels = ["매우 더움", "더움", "보통", "신성함", "쌀쌀함", "추움", "매우 추움"];

        let index = 0;
        for (const point of tempPoints) {
          console.log(point);
          if (isFeelLikeTemp >= point) break;
          index++;
        }

        feeling.value = lavels[index];

        let isProcessedData = [
          { name: "일출시간", value: Unix_timestamp(isTimeOfSunrise) },
          { name: "일몰시간", value: Unix_timestamp(isTimeOfSunset) },
          { name: "가시거리", value: isLimeOfSight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "M" },
        ];

        cityName.value = isInitialCityName.split("/")[1];
        subWeatherData.value = isProcessedData;
      } catch {
        console.log("Subview catch error");
      }
    };

    fetchOpenWeather();

    return {
      currentTime,
      cityName,
      subWeatherData,
      feeling,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "~/scss/main.scss";
.rightContainer {
  // width: 40%;
  // height: 100%;
  width: 324px;
  min-width: 324px;
  height: 700px;
  border-radius: 50px;
  background: linear-gradient(#cb0000, #0e1239);
  box-shadow: 5px 5px 10px gray;
  #cityNameBox {
    width: 100%;
    height: 10%;
    .cityName {
      @include c-center;
      width: 100%;
      height: 100%;
      p {
        color: white;
        font-family: "Poppins", sans-serif;
        line-height: 2.5;
        text-align: center;
        &:first-child {
          width: 241px;
          height: 33px;
          font-size: 1.35rem;
        }
        &:last-child {
          width: 160px;
          height: 19px;
          font-size: 0.9rem;
          font-weight: 100;
        }
      }
    }
  }
  #contentsBox {
    width: 100%;
    height: calc(45% - 16px);
    margin-top: 16px;
    .buttonBox {
      @include center;
      width: 100%;
      height: 20%;
      .buttonBackground {
        width: 224px;
        height: 35px;
        background-color: #370505;
        border-radius: 10px;
        display: flex;
        button {
          width: 112px;
          height: 35px;
          border: 0;
          border-radius: 7.5px;
          outline: 0;
          cursor: pointer;
          &.forecast {
            background-color: transparent;
            color: #a52727;
          }
          &.airquality {
            background: #ff0000;
            color: white;
          }
        }
      }
    }
    .weatherBox {
      width: 100%;
      height: 80%;
      .airCondition {
        @include center;
        width: 100%;
        height: 35%;
        p {
          text-align: center;
          font-size: 2.25rem;
          font-weight: 500;
          font-family: "GmarketSansBold";
          color: #fff;
        }
      }
      .detail {
        width: 100%;
        height: 65%;
        .title {
          @include center;
          width: 100%;
          height: 25%;
          color: white;
          p {
            font-family: "LeferiPoint-WhiteObliqueA";
          }
        }
        .data {
          display: flex;
          width: 100%;
          height: 27.5%;
          // background-color: rgb(187, 127, 255);
          .dataName {
            display: flex;
            align-items: center;
            width: 50%;
            height: 100%;
            font-family: "LeferiPoint-WhiteObliqueA";
            p {
              &:first-child {
                display: block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #ffde23;
                margin-left: 50px;
              }
              &:last-child {
                margin-left: 10px;
                color: white;
                font-weight: 300;
                font-size: 0.9rem;
              }
            }
          }
          .dataValue {
            display: flex;
            align-items: center;
            justify-content: right;
            width: 50%;
            height: 100%;
            font-family: "LeferiPoint-WhiteObliqueA";
            p {
              color: white;
              font-weight: 300;
              margin-right: 50px;
              span {
                font-weight: 600;
              }
            }
          }
        }
      }
    }
  }
  nav {
    @include center-sb;
    width: calc(100% - 100px);
    height: 10%;
    padding: 0 50px;
    i {
      color: rgb(255, 255, 255);
      font-size: 1.15rem;
      cursor: pointer;
      transition: all 0.2s ease;
      &:hover {
        color: #799ed0;
      }
    }
  }
}
</style>

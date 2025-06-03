<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Super Dashboard Casa</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleTheme">
        <v-icon>{{
          $vuetify.theme.global.name.value === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night'
        }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="6">
            <v-card elevation="4">
              <v-card-title><v-icon color="primary" left>mdi-clock</v-icon>Orologio</v-card-title>
              <v-card-text><h2>{{ currentTime }}</h2></v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card elevation="4">
              <v-card-title><v-icon color="primary" left>mdi-weather-partly-cloudy</v-icon>Meteo</v-card-title>
              <v-card-text>
                <v-chip v-if="weather" color="blue" class="ma-2">
                  {{ weather.temp }} °C, {{ weather.description }}
                  <v-icon right>mdi-{{ weather.icon }}</v-icon>
                </v-chip>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col v-for="(room, index) in rooms" :key="index" cols="12" sm="6" md="4">
            <v-card elevation="4">
              <v-card-title><v-icon color="primary" left>mdi-thermometer</v-icon>{{ room.name }}</v-card-title>
              <v-card-text>
                <v-chip color="blue" class="ma-2">{{ room.temperature.toFixed(1) }} °C</v-chip>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6">
            <v-card elevation="4">
              <v-card-title><v-icon color="primary" left>mdi-water-percent</v-icon>Umidità</v-card-title>
              <v-card-text>
                <v-chip color="teal" class="ma-2">Interna: {{ humidity.indoor }}%</v-chip>
                <v-chip color="teal" class="ma-2">Esterna: {{ humidity.outdoor }}%</v-chip>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card elevation="4">
              <v-card-title><v-icon color="primary" left>mdi-air-filter</v-icon>Qualità Aria</v-card-title>
              <v-card-text>
                <v-chip color="purple" class="ma-2">Interna: {{ airQuality.indoor }} µg/m³</v-chip>
                <v-chip color="purple" class="ma-2">Esterna: {{ airQuality.outdoor }} µg/m³</v-chip>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-card elevation="4">
              <v-card-title><v-card-title>Storico Temperatura</v-card-title></v-card-title>
              <v-card-text><canvas id="tempChart"></canvas></v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card elevation="4">
              <v-card-title>Storico Umidità</v-card-title>
              <v-card-text><canvas id="humidityChart"></canvas></v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col v-for="(light, index) in lights" :key="index" cols="12" sm="6" md="4">
            <v-card elevation="4">
              <v-card-title><v-icon color="primary" left>mdi-lightbulb</v-icon>{{ light.name }}</v-card-title>
              <v-card-text>
                <v-chip :color="light.status ? 'green' : 'red'" class="ma-2">
                  {{ light.status ? 'Accesa' : 'Spenta' }}
                </v-chip>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  :color="light.status ? 'red' : 'green'"
                  @click="toggleLight(index)"
                  variant="outlined"
                >
                  {{ light.status ? 'Spegni' : 'Accendi' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col v-for="(camera, index) in cameras" :key="index" cols="12" sm="6">
            <v-card elevation="4">
              <v-card-title><v-icon color="primary" left>mdi-cctv</v-icon>{{ camera.name }}</v-card-title>
              <v-card-text>
                <video :src="camera.url" controls autoplay style="height: 200px; width: 100%;" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card elevation="4">
              <v-card-title><v-icon color="primary" left>mdi-server</v-icon>Stato NAS</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="3"><v-chip color="orange" class="ma-2">CPU: {{ nasInfo.cpu }}%</v-chip></v-col>
                  <v-col cols="12" sm="3"><v-chip color="orange" class="ma-2">RAM: {{ nasInfo.ram }}%</v-chip></v-col>
                  <v-col cols="12" sm="3"><v-chip color="orange" class="ma-2">Disco: {{ nasInfo.disk }}%</v-chip></v-col>
                  <v-col cols="12" sm="3"><v-chip color="orange" class="ma-2">Temp: {{ nasInfo.temp }} °C</v-chip></v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card elevation="4">
              <v-card-title><v-icon color="primary" left>mdi-alert</v-icon>Log Allarmi</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="search"
                  label="Cerca allarmi"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  class="ma-4"
                ></v-text-field>
                <v-select
                  v-model="severityFilter"
                  :items="['all', 'high', 'medium']"
                  label="Filtra per gravità"
                  class="ma-4"
                ></v-select>
                <v-data-table
                  :headers="alarmHeaders"
                  :items="filteredAlarms"
                  :search="search"
                  :items-per-page="5"
                  class="elevation-1"
                >
                  <template v-slot:item="{ item }">
                    <tr>
                      <td>{{ item.time }}</td>
                      <td>{{ item.event }}</td>
                      <td><v-chip :color="item.severity === 'high' ? 'red' : 'orange'">{{ item.severity }}</v-chip></td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="2000">
          {{ snackbarText }}
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import mqtt from 'mqtt';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { debounce } from 'lodash';

export default {
  name: 'App',
  data() {
    return {
      currentTime: '',
      weather: null,
      rooms: [
        { name: 'Soggiorno', temperature: 22.0 },
        { name: 'Bagno', temperature: 21.5 },
        { name: 'Camera', temperature: 20.8 },
      ],
      humidity: { indoor: 45, outdoor: 60 },
      airQuality: { indoor: 25, outdoor: 40 },
      lights: [
        { name: 'Soggiorno', status: false },
        { name: 'Bagno', status: false },
        { name: 'Camera', status: false },
      ],
      cameras: [
        { name: 'Esterna', url: 'rtsp://<IP>:<PORT>/stream' },
        { name: 'Interna', url: 'rtsp://<IP>:<PORT>/stream' },
      ],
      nasInfo: { cpu: 0, ram: 0, disk: 0, temp: 0 },
      alarms: [],
      alarmHeaders: [
        { title: 'Ora', key: 'time' },
        { title: 'Evento', key: 'event' },
        { title: 'Gravità', key: 'severity' },
      ],
      search: '',
      severityFilter: 'all',
      tempData: [],
      humidityData: [],
      tempChart: null,
      humidityChart: null,
      client: null,
      snackbar: false,
      snackbarText: '',
      snackbarColor: '',
    };
  },
  computed: {
    filteredAlarms() {
      if (this.severityFilter === 'all') return this.alarms;
      return this.alarms.filter((alarm) => alarm.severity === this.severityFilter);
    },
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
    this.initCharts();
    this.client = mqtt.connect('mqtt://192.168.8.113:1883');
    this.client.on('connect', () => {
      console.log('Connesso al broker MQTT');
      this.client.subscribe('casa/+/stato');
      this.client.subscribe('casa/+/temperatura');
      this.client.subscribe('casa/+/umidita');
      this.client.subscribe('casa/+/qualita-aria');
      this.client.subscribe('casa/allarmi');
    });
    this.client.on('message', (topic, message) => {
      const parts = topic.split('/');
      const type = parts[1];
      const room = parts[2] || '';
      const value = message.toString();

      if (type === 'luce') {
        const index = this.lights.findIndex((l) => l.name.toLowerCase() === room);
        if (index !== -1) {
          this.lights[index].status = value === 'ON';
          this.showSnackbar(
            `${this.lights[index].name} ${value === 'ON' ? 'accesa' : 'spenta'}`,
            value === 'ON' ? 'green' : 'red'
          );
        }
      } else if (type === 'temperatura') {
        const index = this.rooms.findIndex((r) => r.name.toLowerCase() === room);
        if (index !== -1) {
          this.rooms[index].temperature = parseFloat(value);
          this.updateTempChart(this.rooms[index].temperature);
        }
      } else if (type === 'umidita') {
        if (room === 'interna') this.humidity.indoor = parseFloat(value);
        else if (room === 'esterna') this.humidity.outdoor = parseFloat(value);
        this.updateHumidityChart(room === 'interna' ? this.humidity.indoor : this.humidity.outdoor);
      } else if (type === 'qualita-aria') {
        if (room === 'interna') this.airQuality.indoor = parseFloat(value);
        else if (room === 'esterna') this.airQuality.outdoor = parseFloat(value);
      } else if (type === 'allarmi') {
        this.alarms.unshift({
          time: new Date().toLocaleString(),
          event: value,
          severity: value.includes('porta') ? 'high' : 'medium',
        });
        if (this.alarms.length > 50) this.alarms.pop();
        this.showSnackbar(`Allarme: ${value}`, 'red');
      }
    });
    this.fetchWeather();
    this.fetchNasInfo();
    setInterval(this.fetchNasInfo, 30000);
  },
  methods: {
    updateTime() {
      this.currentTime = new Date().toLocaleString();
    },
    async fetchWeather() {
      try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            q: 'Rome,IT', // Sostituisci con la tua città
            appid: '<TUA_CHIAVE_API>', // Inserisci la chiave OpenWeatherMap
            units: 'metric',
          },
        });
        this.weather = {
          temp: response.data.main.temp,
          description: response.data.weather[0].description,
          icon: this.getWeatherIcon(response.data.weather[0].main),
        };
      } catch (error) {
        console.error('Errore recupero meteo:', error);
      }
    },
    getWeatherIcon(condition) {
      const icons = {
        Clear: 'weather-sunny',
        Clouds: 'weather-cloudy',
        Rain: 'weather-rainy',
        Snow: 'weather-snowy',
      };
      return icons[condition] || 'weather-partly-cloudy';
    },
   
async fetchNasInfo() {
    try {
        const response = await axios.get('http://192.168.8.113:8080/api/nas-info');
        this.nasInfo = response.data;
    } catch (error) {
        console.error('Errore recupero info NAS:', error);
    }
},

    toggleLight(index) {
      const newState = !this.lights[index].status;
      this.client.publish(
        `casa/luce/${this.lights[index].name.toLowerCase()}/comando`,
        newState ? 'ON' : 'OFF'
      );
      this.lights[index].status = newState;
      this.showSnackbar(
        `${this.lights[index].name} ${newState ? 'accesa' : 'spenta'}`,
        newState ? 'green' : 'red'
      );
    },
    toggleTheme() {
      this.$vuetify.theme.global.name.value =
        this.$vuetify.theme.global.name.value === 'dark' ? 'light' : 'dark';
    },
    initCharts() {
      const tempCtx = document.getElementById('tempChart').getContext('2d');
      this.tempChart = new Chart(tempCtx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Temperatura (°C)',
              data: this.tempData,
              borderColor: '#1976D2',
              backgroundColor: 'rgba(25, 118, 210, 0.2)',
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: 'Tempo' } },
            y: { title: { display: true, text: 'Temperatura (°C)' } },
          },
        },
      });

      const humidityCtx = document.getElementById('humidityChart').getContext('2d');
      this.humidityChart = new Chart(humidityCtx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Umidità (%)',
              data: this.humidityData,
              borderColor: '#26A69A',
              backgroundColor: 'rgba(38, 166, 154, 0.2)',
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: 'Tempo' } },
            y: { title: { display: true, text: 'Umidità (%)' } },
          },
        },
      });
    },
    updateTempChart: debounce(function (temp) {
      const now = new Date().toLocaleTimeString();
      this.tempData.push(temp);
      this.tempChart.data.labels.push(now);
      if (this.tempData.length > 20) {
        this.tempData.shift();
        this.tempChart.data.labels.shift();
      }
      this.tempChart.update();
    }, 1000),
    updateHumidityChart: debounce(function (humidity) {
      const now = new Date().toLocaleTimeString();
      this.humidityData.push(humidity);
      this.humidityChart.data.labels.push(now);
      if (this.humidityData.length > 20) {
        this.humidityData.shift();
        this.humidityChart.data.labels.shift();
      }
      this.humidityChart.update();
    }, 1000),
    showSnackbar(text, color) {
      this.snackbar = true;
      this.snackbarText = text;
      this.snackbarColor = color;
    },
  },
  beforeUnmount() {
    if (this.client) this.client.end();
    if (this.tempChart) this.tempChart.destroy();
    if (this.humidityChart) this.humidityChart.destroy();
  },
};
</script>

<style>
.v-card {
  transition: all 0.3s ease;
}
.v-card:hover {
  transform: scale(1.02);
}
.v-chip {
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
</style>

import { createApp } from 'vue';
import App from './App.vue';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css'; // Importa icone

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark', // Tema scuro di default
    themes: {
      dark: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
        },
      },
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#E0E0E0',
          accent: '#3F51B5',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi', // Usa icone Material Design
  },
});

const app = createApp(App);
app.use(vuetify);
app.mount('#app');

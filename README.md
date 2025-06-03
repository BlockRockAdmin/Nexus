# Nexus Dashboard: Il Cuore di BlockRock (Alpha)

![Preview Nexus](https://github.com/BlockRockAdmin/Nexus/blob/main/src/assets/preview.jpg)

**Nexus** è la maschera di **BlockRock**, una dashboard di automazione domestica che evolve in una blockchain P2P in Rust. Monitora NAS, meteo, luci, telecamere e allarmi con Vue 3, Vuetify, Chart.js, Axios e MQTT, plasmando un avatar digitale che riflette le tue autenticazioni continue. È l’inizio di un universo modulare chiamato **Zion**, con nodi IoT (Samsung S9), integrazione Tron (Nile Testnet), e una narrativa RPG ispirata a *Lies of P*, *Trigun*, *Berserk* e *Attack on Titan*.

## Visione
**Nexus** è il tuo “io” digitale in un ambiente domestico, costruito su:
- **LifeForge**: App Android gamificata.
- **IoT**: Nodi su smartphone per GPS e sensori solari.
- **Blockchain**: Scambio continuo di autenticazioni, oltre le criptovalute.
- **AI/ML**: ClearML per analisi EEG (DistilBERT).
- **Dispositivi**: myCobot 280 e Meta Quest 3.

## Installazione
1. Clona: `git clone git@github.com:BlockRockAdmin/Nexus.git`
2. Installa: `npm install`
3. Configura la chiave API OpenWeatherMap in `src/App.vue`
4. Compila: `npm run build`
5. Deploy su `/var/www/dashboard` con Nginx (porta 8080)

## Problemi Noti
- Caricamento font (502 Bad Gateway)
- Routing API NAS (404)
- Connessione MQTT instabile
- Errori di compilazione (process/browser)

## Futuro
- Ponti cross-chain (Rubic, Router Nitro)
- Avatar dinamici stile *Warcraft III*
- Neoterra Nexus RPG con scelte morali
- Integrazione AI come “Cortana”

## Licenza
MIT

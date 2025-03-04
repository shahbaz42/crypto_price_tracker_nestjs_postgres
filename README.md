## Crypto Price Tracker
This project is a Nest.js-based crypto price tracker that fetches and monitors the prices of Ethereum and Polygon every 5 minutes. It provides APIs for retrieving historical prices, setting alerts, and calculating swap rates. Additionally, it triggers email alerts when price thresholds are met.

- **Nest.js**  
- **Moralis API** (for fetching crypto prices)  
- **Postgres Typeorm**  
- **Swagger** (for API documentation)  
- **Clean code Monorepo architecture**  
- **Dockerized setup** (Runs with `docker-compose up --build`)

## How to run this project using docker compose
1. Clone this repository
2. Create a .env.crypto-price-tracker
```bash
touch .env.crypto-price-tracker
```
3. Add the following environment variables to the .env.crypto-price-tracker file
```bash
PORT=3000
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123456789
POSTGRES_DB=crypto_price_tracker
MORALIS_API_KEY=<YOUR_MORALIS_API_KEY>
EMAIL_USER=<Notification Sender Email>
EMAIL_PASS=<Notification Sender Email Password>
PRICE_SURGE_ALERT_EMAIL=<Surge Alert notification Email>
PRICE_SURGE_PERCENTAGE=<The percentage increase in price that will trigger an alert>
```
2. Run the following command in the root directory of the project
```bash
docker compose --env-file .env.crypto-price-tracker up --build
```

## How to run the project locally 
1. Clone this repository
2. Create a .env.crypto-price-tracker as described above
4. Run the following command in the root directory of the project
```bash
yarn install
yarn start:dev
```

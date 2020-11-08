De tekniker jag har använt mig av är de som visades under kursmomenten.
Använde mig av dessa för att de var familjära, och för att bli mer bekväm med dem.


dependencies:

    bcryptjs - för att cryptera lösenord
    cors - för att hantera data mellan api och frontend
    dotenv - för att spara jwtsecret
    express - vald teknik för att bygga api:et och hantera routes
    jsonwebtoken - för att hantera inloggningar
    morgan - för att hantera felaktiga requests
    sqlite3 - som databas för att spara data

routes:

    POST: /register
        skapar en användare med email och ett krypterat lösenord

    POST: /login
        loggar in och autentiserar en användare
        med hjälp av bcryptjs

    GET: /objects
        hämtar alla handelsobjekt från databasen

    PUT: /objects
        updaterar priset på alla objekt i databasen
        med hjälp av slumpmässigt genererade priser från socket-servern

    PUT: /objects/buy
        uppdaterar antal tillgängliga objekt i objects-databasen
        vid köp

    PUT: /objects/sell
        uppdaterar antal tillgängliga objekt i objects-databasen
        vid försäljning

    POST: /accounts
        skapar ett konto för en specifik användare i accounts-databasen

    GET: /accounts
        hämtar information om en specifik användare från accounts-databasen

    PUT: /accounts/buy
        uppdaterar antal tillgängliga objekt i accounts-databasen

    PUT: /accounts/sell
        uppdaterar antal tillgängliga objekt i accounts-databasen
        vid försäljning
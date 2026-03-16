# Reaktor RPS League/BAD API Assignment

The service is deployed at: [reaktor.sologit.com](https://reaktor.sologit.com)

## Requirements

To run this project you need docker and bash or a similar shell.

### How to run the project locally with the development config:

#### 1. First configure the BAD_API_URL and the API_KEY variables in dev.env

```
BAD_API_URL=http://example.com
API_KEY=yourapikey
```

#### 2. Configure the frontend environment

Change directory to /web and create a .env file with the following contents

```
VITE_API_URL=http://localhost:8000
```

#### 3. Load your environment variables

The following command configures some aliases in you shell to help manage the
system.

```
source load.env
```

#### 4. Run the setup script

This alias runs a script installs everything needed to run the project

```
run-setup
```

#### 5. Create the development database

This alias runs prisma in one of the containers to migrate the database

```
migrate-dev
```

#### 6. Run the development server

This alias runs docker compose with the compose files

```
run-dev
```

#### 7. Visit localhost

[localhost](http://localhost:5173)

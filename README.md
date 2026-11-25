# IKM DPMPTSP APP

A Laravel-based web application using React and Inertia.js.

## Requirements

-   PHP 8.1 or higher
-   Composer
-   Node.js & NPM
-   MySQL/MariaDB

## Project Setup

1. Clone the repository:

```bash
git clone https://github.com/daffashi0/gpp-app.git
```

```bash
cd gpp-app
```

2. Install PHP dependencies:

```bash
composer install
```

3. Install JavaScript dependencies:

```bash
npm install
```

4. Environment setup:

```bash
cp .env.example .env
```

```bash
php artisan key:generate
```

5. Configure your database in .env file:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

6. Run database migrations:

```bash
php artisan migrate
```

7. Start the development servers:

Terminal 1 - Laravel server:

```bash
php artisan serve
```

Terminal 2 - Vite development server:

```bash
npm run dev
```

## Features

-   Laravel Sanctum authentication
-   Inertia.js + React frontend
-   Excel import/export functionality

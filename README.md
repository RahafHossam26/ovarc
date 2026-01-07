# Digital Bookstore Management System

This is a backend system built for the Ovarc Backend Assessment. It provides a robust API for synchronizing bookstore inventory via CSV files and generating detailed PDF store reports.

## Features
- **CSV Ingestion**: An endpoint to process inventory data, handling automatic creation of Authors, Books, and Stores with "upsert" logic for inventory counts.
- **PDF Reporting**: Generates a dynamic PDF report including the Top 5 Priciest Books and Top 5 Prolific Authors for a specific store.
- **Database**: Uses SQLite for a portable, zero-config relational database experience (stored in `database.sqlite`).
- **Architecture**: Follows a modular MVC-style structure (Models, Controllers, and Routes).

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: SQLite3
- **Tools**: PDFKit (Report generation), Multer (File uploads), CSV-Parser.

---

## Getting Started

### Prerequisites
- Node.js installed on your machine.
- A tool to test APIs (like Postman or Insomnia).

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/RahafHossam26/ovarc.git](https://github.com/RahafHossam26/ovarc.git)
   cd ovarc
2. **Install dependencies:**

   ```bash
   npm install
3. **Start the server:**

   ```bash
    npm start
    The server will run at http://localhost:3000.

### API Endpoints
1. **Ingest Inventory**
Endpoint: POST /api/inventory/upload

Payload: multipart/form-data

Key: file (Upload your CSV file here)

2. **Download Store Report**
Endpoint: GET /api/store/:id/download-report

Description: Generates and downloads a PDF report for the specified store ID.
### Project Structure
   ```plaintext
    /src
    /controllers  # Business logic (CSV parsing & PDF generation)
    /models       # Sequelize database models
    /routes       # API route definitions
    app.js        # Entry point
    package.json    # Dependencies and scripts



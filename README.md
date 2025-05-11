# Transaction Checker

A web application built with React and Python Flask for extracting and validating transaction parameters from PDF documents.

## Prerequisites

- Node.js v16 or higher
- Python 3.8 or higher
- pip (Python package manager)

## Project Structure

```
transaction-checker/
├── src/               # React source files
│   ├── components/    # React components
│   ├── pages/        # Page components
│   └── services/     # API services
├── Server/           # Flask backend
│   ├── server.py     # Main server file
│   └── requirements.txt
└── public/           # Static assets
```

## Setup Instructions

### 1. Frontend Setup

First, install the React frontend dependencies:

```bash
# Install main app dependencies
cd transaction-checker
npm install

```

### 2. Backend Setup

Set up the Python Flask backend:

```bash
cd Server

# Create and activate virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

```

## Running the Application

1. Start the Flask backend server:

```bash
cd Server
python server.py
```

The backend will start on `http://localhost:3001`

2. In a new terminal, start the React frontend:

```bash
# From the project root
npm start
```

The frontend will start on `http://localhost:3000`

## Features

- PDF document upload and preview
- Data element extraction from PDFs
- Parameter matching and validation
- Export results to Excel
- Landing page showcase

## Available Scripts

- `npm start` - Run the React development server
- `npm build` - Create production build
- `npm test` - Run tests
- `python server.py` - Run the Flask backend server

## Tech Stack

- Frontend:
  - React.js
  - TailwindCSS
  - React Router
  - ExcelJS
  
- Backend:
  - Flask
  - Google Gemini AI
  - PyPDF2

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)


## License

This project is proprietary and confidential.

## Learn More

- [React Documentation](https://reactjs.org/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
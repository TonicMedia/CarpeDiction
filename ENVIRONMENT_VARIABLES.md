# Environment Variables List

This document lists all environment variables used in the CarpeDiction repository.

## Server-Side Environment Variables

These variables are used in the `server/` directory and should be set in a `.env` file in the `server/` directory.

### 1. `PORT`
- **Usage**: Server port number
- **Location**: `server/server.js` (line 15)
- **Description**: Port on which the Express server listens

### 2. `NODE_ENV`
- **Usage**: Environment type (typically 'production' or 'development')
- **Locations**: 
  - `server/server.js` (lines 21, 26)
  - `server/controllers/user.controller.js` (lines 27, 28, 217, 218)
- **Description**: Determines CORS settings and cookie security settings

### 3. `API_ROOT`
- **Usage**: API root URL
- **Location**: `server/server.js` (line 52)
- **Description**: Base URL for API endpoints (used for WOTD posting)

### 4. `JWT_KEY`
- **Usage**: JWT secret key for token signing and verification
- **Locations**: 
  - `server/controllers/user.controller.js` (lines 25, 215)
  - `server/config/jwt.config.js` (line 7)
- **Description**: Secret key used to sign and verify JSON Web Tokens for user authentication

### 5. `CD_DB_URL`
- **Usage**: MongoDB database connection URL
- **Location**: `server/config/mongoose.config.js` (line 2)
- **Description**: Full MongoDB connection string/URI

## Client-Side Environment Variables

These variables are used in the `client/` directory. React requires environment variables to be prefixed with `REACT_APP_` to be accessible in the browser.

### 1. `REACT_APP_X_RAPIDAPI_KEY`
- **Usage**: RapidAPI key for various API services
- **Locations**: 
  - `client/src/views/Search.js` (line 83)
  - `client/src/components/search/WordsApiRhymes.js` (line 58)
  - `client/src/components/search/WordsApiFreq.js` (line 57)
  - `client/src/components/search/UrbanDict.js` (line 61)
  - `client/src/components/search/WordAssocRes.js` (line 58)
  - `client/src/components/search/LinguaConj.js` (line 57)
  - `client/src/components/search/DeepTrans.js` (lines 57, 82, 106, 130, 154)
- **Description**: API key for RapidAPI services (used for rhymes, frequency, urban dictionary, word associations, conjugation, and translation services)

### 2. `REACT_APP_MW_THES_KEY`
- **Usage**: Merriam-Webster Thesaurus API key
- **Location**: `client/src/components/search/MwThesRes.js` (line 52)
- **Description**: API key for Merriam-Webster Thesaurus API

### 3. `REACT_APP_MW_DICT_KEY`
- **Usage**: Merriam-Webster Dictionary API key
- **Location**: `client/src/components/search/MwDictRes.js` (line 68)
- **Description**: API key for Merriam-Webster Collegiate Dictionary API

### 4. `REACT_APP_NODE_ENV`
- **Usage**: React app environment type
- **Location**: `client/src/App.js` (line 23)
- **Description**: Determines which API URL to use (production vs development)

### 5. `REACT_APP_API_ROOT`
- **Usage**: React app API root URL
- **Location**: `client/src/App.js` (line 23)
- **Description**: Base URL for the backend API when in production mode

## Summary

**Total Environment Variables: 10**

- **Server-side**: 5 variables
- **Client-side**: 5 variables

## Notes

- Server-side variables are loaded via `dotenv` in `server/server.js`
- Client-side variables must be prefixed with `REACT_APP_` to be accessible in React
- Both `.env` files are gitignored (see `.gitignore` and `server/.gitignore`)
- The project uses separate `.env` files for server and client configurations

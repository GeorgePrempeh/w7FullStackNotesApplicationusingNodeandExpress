# GEROS Media Notes Application

A professional full-stack notes application built with Node.js, Express, HTML, CSS, and JavaScript.

## Features

- Full CRUD for notes (Create, Read, Update, Delete)
- User authentication (register, login)
- Persistent storage using JSON files
- Responsive, modern UI
- Professional branding and hero section
- Session management
- Error handling and user feedback

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone https://github.com/GeorgePrempeh/w7FullStackNotesApplicationusingNodeandExpress.git
   cd w7FullStackNotesApplicationusingNodeandExpress/w7FullStackNotesApplicationusingNodeandExpress
   ```
2. **Install dependencies:**
   ```
   npm install
   ```
3. **Start the server:**
   ```
   npm start
   ```
4. **Access the app:**
   - Landing page: http://localhost:3000/
   - Register: http://localhost:3000/register.html
   - Login: http://localhost:3000/login.html
   - Notes dashboard: http://localhost:3000/index.html

## API Endpoints

- `POST /api/register` — Register a new user
- `POST /api/login` — Login
- `POST /api/logout` — Logout
- `GET /api/notes` — Get all notes
- `POST /api/notes` — Create a note
- `PUT /api/notes/:id` — Update a note
- `DELETE /api/notes/:id` — Delete a note

## Deployment

- The app is ready for deployment on [Render](https://render.com/) or similar platforms.
- Add your deployment link here: `[Deployment Link]`

## File Structure

```
public/
  auth.js
  index.html
  landing.html
  login.html
  login.js
  LogoGR.png
  register.html
  register.js
  script.js
  styles.css
data.json
users.json
server.js
package.json
README.md
```

## Screenshots

_Add screenshots of your app here._

## License

MIT

## Author

George Prempeh

---

For any questions or issues, please open an issue on GitHub.

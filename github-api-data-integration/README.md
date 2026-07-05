# Dev-Detective

Dev-Detective is a client-side web application that integrates with the GitHub REST API to search developer profiles, browse repositories, and compare two GitHub users using Battle Mode.

The project is built using Vanilla JavaScript, the native Fetch API, Async/Await, and Promise.all() without using frameworks or Axios.

---

## Features

- Search GitHub users by username
- Display profile information including avatar, name, bio, join date, and portfolio URL
- Show a loading state while data is being fetched
- Display a user-friendly "User Not Found" page for invalid usernames
- Fetch and display the latest five repositories
- Open repository links in a new browser tab
- Format GitHub ISO dates into a readable format
- Battle Mode to compare two GitHub users
- Calculate total repository stars using `reduce()`
- Display the winner and loser based on total stars
- Client-side form validation
- XSS-safe rendering of user-generated content
- Error handling for network failures, API rate limits, invalid responses, and missing data
- Responsive and accessible user interface
- Dark mode support

---

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (ES Modules)
- GitHub REST API
- Native Fetch API
- Async/Await
- Promise.all()

---

## Running the Project

Since the project uses ES Modules, it must be served through a local HTTP server.

Using Python:

```bash
python3 -m http.server 8080
```

Or using Node.js:

```bash
npx serve .
```

Open your browser and visit:

```
http://localhost:8080
```

---

## API Rate Limit

GitHub allows up to 60 unauthenticated API requests per hour.

If additional requests are required, generate a GitHub Personal Access Token and include it in the request headers.

Do not commit personal access tokens to a public repository.

---

## Accessibility

The application includes:

- Semantic HTML
- Keyboard navigation support
- ARIA labels and live regions
- Focus-visible styling
- Reduced motion support
- Responsive layout

---

## Manual Testing

Test the following scenarios before deployment:

- Search for a valid GitHub username.
- Search using an empty input.
- Search using an invalid username.
- Compare two different GitHub users in Battle Mode.
- Attempt to compare the same username twice.
- Test the application without an internet connection.
- Verify the loading indicator appears while requests are in progress.
- Verify repository links open in a new browser tab.

---

## License

This project was developed for educational and internship evaluation purposes.
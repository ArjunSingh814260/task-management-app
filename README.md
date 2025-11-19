# Task Management Application

A simple task management app built with AngularJS. This was built as a learning project to practice AngularJS fundamentals like controllers, services, routing, and directives. It's fully functional and includes authentication, CRUD operations, and some nice-to-have features like drag-and-drop reordering.

## What's Inside

This app lets you:
- Login with any username/password (it's mocked, so no real auth needed)
- View all your tasks in a nice grid layout
- Add new tasks with title, description, status, and due date
- Edit existing tasks (except completed ones)
- Mark tasks as completed
- Filter tasks by status (Pending, In Progress, Completed)
- Search tasks by title
- Sort by due date or title
- Drag and drop to reorder tasks (when no filters are active)

## Tech Stack

- **AngularJS 1.8.3** - Main framework
- **Angular Route** - For navigation
- **JSONPlaceholder API** - Mock API for tasks (since it doesn't have auth, I mocked that part)
- **Jasmine + Karma** - For unit testing
- **Live Server** - For local development

## Getting Started

### Prerequisites

You'll need Node.js and npm installed. If you don't have them, grab them from [nodejs.org](https://nodejs.org/).

### Installation

1. Clone this repo (or download and extract it)
2. Open a terminal in the project folder
3. Run `npm install` to get all the dependencies

That's it! The dependencies are pretty minimal.

### Running the App

Just run:
```bash
npm start
```

This will start a local server on port 8080 and open your browser automatically. If it doesn't open, just go to `http://localhost:8080` manually.

### Running Tests

To run the test suite:
```bash
npm run test:single
```

This runs all tests once and exits. If you want to watch for changes and re-run tests automatically:
```bash
npm run test
```

The tests cover services, controllers, and filters. There are 47 tests total and they should all pass.

## Project Structure

```
task_managment/
├── app/
│   ├── controllers/       # All controllers
│   ├── services/          # Auth and Task services
│   ├── directives/        # Custom directives (drag-drop, task-card)
│   ├── filters/           # Custom filters (date formatting, status classes)
│   └── views/             # HTML templates
├── styles/
│   └── main.css           # All styles in one file
├── tests/                 # Unit tests
├── index.html             # Main entry point
└── package.json           # Dependencies and scripts
```

## How It Works

### Authentication

Since JSONPlaceholder doesn't have authentication, I built a simple mock auth system. When you login with any username/password, it:
- Generates a mock JWT token (base64 encoded JSON)
- Stores it in localStorage
- Uses it to protect routes

The token expires after 24 hours. In a real app, you'd replace this with actual API calls to your backend.

### Task Management

Tasks are fetched from JSONPlaceholder's `/todos` endpoint. Since that API doesn't have descriptions or due dates, I:
- Generate random descriptions from a pool of templates
- Generate random due dates (within the next 30 days)
- Store created/edited tasks in memory (they persist during the session)

When you create or edit a task, it's stored locally. The API calls are simulated but the data is kept in memory for the session.

### Drag and Drop

The drag-and-drop feature only works when:
- No status filter is applied (showing "All")
- No search query is active
- Default sorting is active (due date, ascending)

This keeps things simple and prevents confusion when the list is filtered. The order is saved to localStorage so it persists across page refreshes.

## Assumptions & Decisions

1. **Mock Authentication**: Since we're using a public API without auth, I created a simple mock system. Any username/password works for demo purposes.

2. **Task Descriptions**: JSONPlaceholder doesn't provide descriptions, so I generate them randomly. In a real app, users would enter these.

3. **Due Dates**: Same as descriptions - randomly generated since the API doesn't have them.

4. **Local Storage**: Created/edited tasks are stored in memory during the session. They don't persist after refresh (except for drag order). In production, you'd save these to a real backend.

5. **Completed Tasks**: Once a task is marked as completed, it can't be edited. This is a design decision to keep things simple.

6. **Drag and Drop**: Disabled when filters are active to avoid confusion. You can only reorder the full, unfiltered list.

7. **No Backend**: Everything runs client-side. The app makes API calls to JSONPlaceholder but doesn't have its own backend.

## Enhancements Made

Beyond the basic requirements, I added:

- **Drag and Drop Reordering**: You can drag tasks to reorder them. The order persists in localStorage.
- **Responsive Design**: Works well on mobile, tablet, and desktop screens.
- **Loading States**: Shows loading indicators while fetching data.
- **Error Handling**: Basic error messages when things go wrong.
- **Form Validation**: Client-side validation for required fields.
- **Visual Feedback**: Hover effects, transitions, and visual feedback during drag operations.
- **Unit Tests**: Comprehensive test coverage for services, controllers, and filters.

## Known Limitations

- Tasks created/edited during the session are lost on page refresh (except drag order)
- Authentication is completely mocked - no real security
- No pagination (if you have hundreds of tasks, they all load at once)
- No real-time updates (would need WebSockets or polling)
- Drag and drop disabled when filters are active (by design)

## Development Notes

The code follows AngularJS best practices:
- Controllers handle view logic
- Services handle data operations
- Directives for reusable components
- Filters for data transformation
- Route protection using route resolves

I tried to keep the code clean and readable. Each file has a single responsibility. The CSS uses CSS variables for theming, making it easy to change colors if needed.

## Troubleshooting

**Tests failing?** Make sure Chrome is installed. Karma uses Chrome to run tests.

**Port 8080 already in use?** Change the port in `package.json` or kill whatever's using port 8080.

**Styles not loading?** Make sure you're running the app through the dev server, not just opening `index.html` directly.

**Drag and drop not working?** Make sure no filters are active. Clear any search queries and set status filter to "All".

## License

MIT - feel free to use this however you want.

## Credits

- JSONPlaceholder for the mock API
- AngularJS team for the framework
- All the open source libraries that made this possible

---

If you find any bugs or have suggestions, feel free to open an issue or submit a PR. Happy coding!
# task-management-app
# task-management-app
# task-management-app
# task-management-app
# task-management-app
# task-management-app
# task-management-app
# task-management-app
# task-management-app
# task-management-app

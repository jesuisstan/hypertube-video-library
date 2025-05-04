# Project Documentation: Hypertube Video Library

## Objective

This project aims to create a web application that enables user’s to search for and watch videos.

The player is integrated directly into the site, and the videos are downloaded using the BitTorrent protocol.
To enhance search capabilities, the research engine queries at least two external sources of your choice.
Once a selection is made, the video will be downloaded from the server and streamed on the web player simultaneously.
This means that the player not only displays the video after the download is complete but also streams the video feed directly.

## Implementation

The project was implemented using functional components and popular hooks in ReactJS with TypeScript, leveraging the Next.js framework for server-side rendering and routing. The following steps were taken to complete the project:

1. **Backend Implementation**: Connection to Vercel PostgreSQL cloud database created. PostgreSQL is used for data storage, ensuring reliability and scalability.

2. **Frontend + Backend**: The application is a full-stack exxample, developed using Next.js, incorporating TypeScript for type safety. The application follows a responsive design, ensuring usability across various devices.

3. **Styling**: Tailwind CSS is used for styling, providing a modern and consistent design. The application features utility-first CSS, enabling rapid styling adjustments. The application supports 2 color themes: light and dark.

4. **Language Support**: Hypertube app allows users select between 3 main languages for the interface: English, Français & Русский.

5. **Real-Time Features**: Implemented chat functionality allows users to communicate once matched. Notifications for likes and visits are provided to enhance user engagement.

6. **Version Control**: The code is hosted on GitHub and made publicly accessible. The repository can be found at [https://github.com/jesuisstan/hypertube-video-library](https://github.com/jesuisstan/hypertube-video-library).

7. **Deployment**: The application is deployed on Vercel, providing fast global access. Visit the application at [https://hypertube-video-library.vercel.app](https://hypertube-video-library.vercel.app)

## Results

The deployed version of the app allows users to:

- Authenticate with email and password, creating new accounts or logging into existing ones.
- Create and manage user profiles with interests, preferences, photos.
- Connect with other users based on mutual interests and preferences.
- Chat with users with whome you have matched.

## Installation

To set up and run the Hypertube Video Library project locally, follow these steps:

### Prerequisites

1. Ensure you have the following installed on your system:

   - **Node.js** (v16 or later)
   - **npm** (v7 or later) or **yarn**
   - **PostgreSQL** (if running the database locally)

2. Clone the repository:
   ```sh
   git clone https://github.com/jesuisstan/hypertube-video-library.git
   cd hypertube-video-library
   ```

### DEV mode

1. Install dependencies:

   ```sh
   npm install
   ```

   or

   ```sh
   yarn install
   ```

2. Set up the environment variables:

   - Create a `.env.local` file in the root directory.
   - Fill it following the .env.local.example file

3. Start the development server:

   ```sh
   npm run dev
   ```

   or

   ```sh
   yarn dev
   ```

4. Open the application in your browser:
   ```
   http://localhost:4242
   ```

### PROD mode

1. Build the application for production:

   ```sh
   npm run build
   ```

   or

   ```sh
   yarn build
   ```

2. Start the production server:
   ```sh
   npm start
   ```
   or
   ```sh
   yarn start
   ```

The application should now be running locally or in production mode!

## Demonstration

_(Add demonstration details, screenshots, or links to demo videos here)_ Coming soon...

## Additional info

To request token, produced by this app, you can run the curl cmd (in dev mode, update client_id and client_secret if needed):

on UNIX:

```sh
curl -X POST http://localhost:4242/api/auth/oauth/token \
-H "Content-Type: application/json" \
-d '{"client_id": "my-local-client-id", "client_secret": "my-local-client-secret"}'
```

on WINDOWS (PowerShell):

```sh
curl -X POST http://localhost:4242/api/auth/oauth/token `
-H "Content-Type: application/json" `
-d '{"client_id": "my-local-client-id", "client_secret": "my-local-client-secret"}'
```

in Browser (firstly allow pasting in console):

```sh
fetch('http://localhost:4242/api/auth/oauth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    client_id: 'my-local-client-id',
    client_secret: 'my-local-client-secret',
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error('Error:', error));
```

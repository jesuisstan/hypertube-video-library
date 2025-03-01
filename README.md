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

## Demonstration

_(Add demonstration details, screenshots, or links to demo videos here)_ Coming soon...
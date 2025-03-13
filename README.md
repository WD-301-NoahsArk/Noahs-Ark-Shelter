# Noah’s Ark Shelter

Noah’s Ark Cat and Dog Shelter is a non-profit organization dedicated to rescuing, rehabilitating, and rehoming stray, abandoned, and abused cats and dogs. The shelter provides a safe haven for these animals, offering medical care, food, and socialization until they find their forever homes. The mission is to promote animal welfare and responsible pet ownership.

The shelter relies on donations, volunteers, and community support to continue its operations.

## Application Background

This application is designed to serve as a platform for showcasing the shelter's mission, available pets for adoption, upcoming events, and ways for the community to get involved.

## Frameworks and Technologies Used

- **Frontend:**
  - **Angular 19**: A powerful front-end framework used to build the dynamic user interface.
  - **Tailwind CSS**: A utility-first CSS framework to style the components and pages for responsiveness and design consistency.

- **Backend:**
  - **Hono (TypeScript)**: A minimal and fast web framework to manage server-side logic, API routes, and data handling.
  - **MongoDB**: A NoSQL database used to store shelter data, including pet details, adoption inquiries, events, and user contact information. MongoDB is flexible and scalable, making it an excellent choice for storing structured and semi-structured data.
  - **Firebase Storage**: Used for storing and managing images of pets, events, and other media files related to the shelter. Firebase Storage offers scalable, secure, and easy-to-integrate cloud storage for media content.

## Components

- **Button**: A reusable button component used for various actions, such as submitting forms or navigating between pages.
- **Navbar**: The navigation bar that provides links to the main sections of the site (Home, About, Adoption, Contact, Events).
- **Sidebar**: A sidebar for admin users to quickly manage shelter operations (animals, donations, etc.).
- **Footer**: The footer that includes additional navigation links and contact information.
- **Form**: Used for collecting user input, such as adoption inquiries, contact messages, and donations.

## Pages

- **Home**: The landing page with introductory content, latest news, and donation options.
- **About**: Provides background information about Noah's Ark Shelter, including its mission and team.
- **Adoption**: A list of adoptable cats and dogs with an inquiry form for interested adopters.
- **Contact**: A contact form for users to ask questions or request information.
- **Events**: Lists upcoming events and fundraisers.

## Database

We are using **MongoDB** as the database for storing and managing our shelter data. MongoDB provides a flexible, scalable solution to handle the variety of data the shelter needs, such as:

- Pet profiles (name, breed, age, adoption status, etc.)
- Adoption inquiries
- Event details
- Contact form submissions

MongoDB allows for easy scalability and efficient handling of large amounts of semi-structured data, making it a great choice for this application.

## Image Storage

For storing and serving images, we are using **Firebase Storage**. Firebase provides an easy and secure way to store images such as:

- Pet pictures for adoption listings
- Event flyers and promotional images
- Any other media associated with the shelter

Firebase Storage is highly scalable, secure, and integrates seamlessly with our application, ensuring that image uploads and retrievals are efficient and reliable.

const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Portfolio Builder API',
    description: 'API documentation for Portfolio Builder (CSE 341 Final Project Part 1). Manages Users and Projects collections with complete CRUD operations, error handling, and validation.',
    version: '1.0.0'
  },
  host: 'localhost:8080',
  schemes: ['http', 'https'],
  tags: [
    {
      name: 'Users',
      description: 'Operations for managing users'
    },
    {
      name: 'Projects',
      description: 'Operations for managing portfolio projects'
    }
  ],
  definitions: {
    User: {
      _id: '670732808b89e3bb8e8c1111',
      username: 'johndoe',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Full Stack Web Developer passionate about cloud architectures.',
      role: 'Full Stack Developer',
      skills: ['JavaScript', 'Node.js', 'Express', 'MongoDB', 'React'],
      githubUrl: 'https://github.com/johndoe',
      portfolioUrl: 'https://johndoe.dev',
      createdAt: '2026-10-09T12:00:00.000Z',
      updatedAt: '2026-10-09T12:00:00.000Z'
    },
    UserInput: {
      username: 'johndoe',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Full Stack Web Developer passionate about cloud architectures.',
      role: 'Full Stack Developer',
      skills: ['JavaScript', 'Node.js', 'Express', 'MongoDB'],
      githubUrl: 'https://github.com/johndoe',
      portfolioUrl: 'https://johndoe.dev'
    },
    Project: {
      _id: '670732808b89e3bb8e8c2222',
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce web application with payment gateway.',
      userId: '670732808b89e3bb8e8c1111',
      technologies: ['Node.js', 'MongoDB', 'Express', 'Stripe'],
      githubRepo: 'https://github.com/johndoe/ecommerce-app',
      liveUrl: 'https://ecommerce-demo.onrender.com',
      completed: true,
      featured: true,
      createdAt: '2026-10-09T12:00:00.000Z',
      updatedAt: '2026-10-09T12:00:00.000Z'
    },
    ProjectInput: {
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce web application with payment gateway.',
      userId: '670732808b89e3bb8e8c1111',
      technologies: ['Node.js', 'MongoDB', 'Express', 'Stripe'],
      githubRepo: 'https://github.com/johndoe/ecommerce-app',
      liveUrl: 'https://ecommerce-demo.onrender.com',
      completed: true,
      featured: true
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);

const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Portfolio Builder API',
    description: 'API documentation for Portfolio Builder (CSE 341 Final Project Part 2). Manages Users, Projects, Experiences, and Contacts collections with complete CRUD operations, OAuth 2.0 authorization, input validation, and centralized error handling.',
    version: '2.0.0'
  },
  host: 'localhost:8080',
  schemes: ['http', 'https'],
  tags: [
    {
      name: 'Auth',
      description: 'Authentication and OAuth session operations'
    },
    {
      name: 'Users',
      description: 'Operations for managing users'
    },
    {
      name: 'Projects',
      description: 'Operations for managing portfolio projects'
    },
    {
      name: 'Experiences',
      description: 'Operations for managing career and educational experiences'
    },
    {
      name: 'Contacts',
      description: 'Operations for managing portfolio contact inquiries'
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
    },
    Experience: {
      _id: '670732808b89e3bb8e8c3333',
      userId: '670732808b89e3bb8e8c1111',
      company: 'Tech Solutions Inc.',
      role: 'Backend Engineer',
      location: 'Remote',
      startDate: '2024-01-15',
      endDate: null,
      current: true,
      description: 'Architecting and maintaining cloud REST APIs using Node.js, Express, and MongoDB Atlas.',
      technologies: ['Node.js', 'Express', 'MongoDB', 'Docker', 'AWS'],
      createdAt: '2026-10-09T12:00:00.000Z',
      updatedAt: '2026-10-09T12:00:00.000Z'
    },
    ExperienceInput: {
      userId: '670732808b89e3bb8e8c1111',
      company: 'Tech Solutions Inc.',
      role: 'Backend Engineer',
      location: 'Remote',
      startDate: '2024-01-15',
      endDate: null,
      current: true,
      description: 'Architecting and maintaining cloud REST APIs using Node.js, Express, and MongoDB Atlas.',
      technologies: ['Node.js', 'Express', 'MongoDB', 'Docker', 'AWS']
    },
    Contact: {
      _id: '670732808b89e3bb8e8c4444',
      userId: '670732808b89e3bb8e8c1111',
      senderName: 'Sarah Connor',
      senderEmail: 'sarah.connor@example.com',
      subject: 'Senior Developer Opportunity',
      message: 'Hello, I reviewed your portfolio and would love to discuss an open backend developer position.',
      read: false,
      createdAt: '2026-10-09T12:00:00.000Z'
    },
    ContactInput: {
      userId: '670732808b89e3bb8e8c1111',
      senderName: 'Sarah Connor',
      senderEmail: 'sarah.connor@example.com',
      subject: 'Senior Developer Opportunity',
      message: 'Hello, I reviewed your portfolio and would love to discuss an open backend developer position.',
      read: false
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);

export const openApiConfig = {
  info: {
    description: 'Backend API contract for Customer App, Delivery Agent App, Vendor Panel, Admin',
    title: 'Zepto-like System Backend API',
    version: '1.0.0',
  },
  openapi: '3.0.0',
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
    },
  ],
  tags: [
    { name: 'Public' },
    { name: 'Customer' },
    { name: 'Delivery' },
    { name: 'Vendor' },
    { name: 'Admin' },
    { name: 'Internal' },
  ],
};

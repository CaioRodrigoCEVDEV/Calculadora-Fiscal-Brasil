module.exports = {
  apps: [
    {
      name: 'calculadora-fiscal-brasil',
      cwd: __dirname,
      script: 'npm',
      args: 'start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'development',
        PORT: 3011,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3011,
      },
    },
  ],
};

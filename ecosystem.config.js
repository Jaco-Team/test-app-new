module.exports = {
  apps: [
    {
      name: 'site_new',
      exec_mode: 'cluster',
      instances: 'max', 
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env_local: {
        APP_ENV: 'local' // APP_ENV=local
      },
      env_development: {
        APP_ENV: 'dev' // APP_ENV=dev
      },
      env_production: {
        APP_ENV: 'prod' // APP_ENV=prod
      }
    }
  ],

  deploy : {
    production : {
      user : 'root',
      host : '134.0.119.199',
      ref  : 'origin/main',
      repo : 'git@github.com:vito3315/test-app-new.git',
      path : '/root/test-app-new',
      'pre-deploy-local': '',
      'post-deploy' : 'npm run deploy:prod',
      'pre-setup': ''
    }
  }
}
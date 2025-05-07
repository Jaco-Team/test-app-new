module.exports = {
  apps: [
    {
      name: 'site_new',
      exec_mode: 'cluster',
      //instances: 'max', 
      instances: '6', 
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
      //host : '79.174.86.137',
      ref  : 'origin/main',
      repo : 'git@github.com:Jaco-Team/test-app-new.git',
      path : '/root/test-app-new',
      //path: '/var/www/test-app-new',
      'pre-deploy-local': '',
      'post-deploy' : 'npm run deploy:prod',
      'pre-setup': ''
    }
  }
}
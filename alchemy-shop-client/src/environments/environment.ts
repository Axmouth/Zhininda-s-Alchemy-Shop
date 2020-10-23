// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
};
export const apiRoot = 'http://api.zhinindas.shop.test/api/v1/';
export const apiRootServer = 'http://api.zhinindas.shop.test/api/v1/';
// export const apiRoot = 'http://localhost:6543/api/v1/';
export const jwtWhitelist = [
  'localhost',
  'localhost:39051',
  '[::1]:39051',
  'localhost:4200',
  'localhost:3199',
  'localhost:5000',
  'api.zhinindas.shop.test',
];
export const websiteUrl = 'http://zhinindas.shop.test';

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

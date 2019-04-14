// This file is required by karma.conf.js and loads recursively all the .spec and framework files

/**
 * This file is required by karma.conf.js and loads recursively all the .spec and framework files.
 */
import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

/**
 * @ignore
 */
declare const require: any;

// First, initialize the Angular testing environment.
/**
 * @ignore
 */
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
/**
 * @ignore
 */
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.

/**
 * @ignore
 */
context.keys().map(context);

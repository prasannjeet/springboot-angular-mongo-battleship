import {browser, by, element} from 'protractor';

/**
 * @ignore
 */
export class AppPage {

    /**
     * @ignore
     */
    navigateTo() {
        return browser.get(browser.baseUrl) as Promise<any>;
    }

    /**
     * @ignore
     */
    getTitleText() {
        return element(by.css('app-root h1')).getText() as Promise<string>;
    }
}

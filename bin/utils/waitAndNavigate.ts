import { Page } from "puppeteer";

const waitAndNavigate = async <T>(
  page: Page,
  navigationPromise: Promise<T>,
  timeout?: number
) => {
  await Promise.all([page.waitForNavigation({timeout: timeout || 60000}), navigationPromise]);
};

export default waitAndNavigate;

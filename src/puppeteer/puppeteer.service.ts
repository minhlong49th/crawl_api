import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class PuppeteerService {
  async fetchPartnerData(targetUrl: string): Promise<string> {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.CHROMIUM_PATH, // Set your Chrome/Chromium executable path if using puppeteer-core
    });

    const page = await browser.newPage();

    // Log all requests
    page.on('request', request => {
      console.log(`[Request] ${request.method()} ${request.url()}`);
    });

    // Log all responses
    page.on('response', response => {
      console.log(`[Response] ${response.status()} ${response.url()}`);
    });

    // Setup waitForResponse before navigation to catch the request
    const responsePromise = page.waitForResponse(
      response => response.url() === 'https://api.goaffpro.com/partner/' && response.request().method() === 'GET',
      { timeout: 60000 } // 30 seconds timeout
    );

    // Navigate to the target URL
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

    // Wait for the response
    const response = await responsePromise;

    // Sometimes the response body might be empty or cause errors if it’s an opaque CORS preflight, so handle safely
    let data: string;
    try {
      data = await response.text();
     

    } catch (err) {
      console.warn('Error fetching or reading response body:', err);
      data = '';
    }

    await browser.close();

    return data;
  }


}

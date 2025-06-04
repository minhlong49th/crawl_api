import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class PuppeteerService {
  async fetchPartnerData(targetUrl: string): Promise<string | null> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    //   executablePath: process.env.CHROME_EXECUTABLE_PATH, // For Docker support
    });

    const page = await browser.newPage();
    await page.goto(targetUrl, { waitUntil: 'networkidle2' });

    let bodyText: string | null = null;

    try {
      const response = await page.waitForResponse((res) =>
        res.url().includes('https://api.goaffpro.com/partner/')
      );

      if (response && response.ok()) {
        bodyText = await response.text();
      } else {
        console.warn('Response not OK or undefined');
      }
    } catch (error) {
      console.error('Error fetching or reading response body:', error);
    }

    await browser.close();
    return bodyText;
  }
}

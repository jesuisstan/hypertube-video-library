import axios from 'axios';
import * as cheerio from 'cheerio';

export async function search(query: string, type: number = 0) {
  if (!query) throw new Error('Please specify a search query');

  try {
    let page = 1;
    const scrapedData: any[] = [];

    while (true) {
      const response = await axios.get(
        `https://thepiratebay10.org/search/${encodeURIComponent(query)}/${page}/99/${type}`
      );
      // Ensure the response is HTML
      if (typeof response.data !== 'string') {
        throw new Error('Unexpected response type, expected HTML.');
      }

      const $ = cheerio.load(response.data);
      const tableRows = $('table tbody tr:not(:last-child)');

      tableRows.each((_, element) => {
        const category = $(element)
          .find('td:nth-child(1) center a')
          .map((_, el) => $(el).text().trim())
          .get();
        const name = $(element).find('td:nth-child(2) div a').text().trim();
        const magnetLink = $(element).find('td:nth-child(2) a:nth-child(2)').attr('href');
        const tpbLink = $(element).find('td:nth-child(2) a:nth-child(1)').attr('href');
        const details = $(element).find('font.detDesc').text().trim().split(', ');
        const uploadedDate = details[0]?.replace('Uploaded ', '');
        const size = details[1]?.replace('Size ', '');
        const uploader = details[2]?.replace('ULed by ', '');

        scrapedData.push({
          category,
          name,
          tpbLink: tpbLink || '',
          magnetLink,
          uploadedDate: uploadedDate || '',
          size: size || '',
          uploader: uploader || '',
        });
      });

      const nextPageLink = $('table tbody tr:last-child td a').attr('href');
      if (!nextPageLink) {
        break;
      }

      page++;
    }

    return scrapedData;
  } catch (error) {
    console.error('Error while scraping PirateBay:', error);
    return null;
  }
}

'use server';
import * as cheerio from 'cheerio';
import fs from 'fs';
import unzipper from 'unzipper';
import path from 'path';
import { getLangCodeFromFilename } from '@/utils/getLangaugeName';
import ffmpeg from 'fluent-ffmpeg';

interface SubInfo {
  langCode: string;
  filePath: string;
}

interface RemoteSubtitle {
  lang: string;
  rating: string;
  pageUrl: string;
  downloadUrl?: string;
  sizeMb: number;
}

export async function fetchSubtitles(imdb_id: string): Promise<SubInfo[]> {
  const subtitlesDir = path.join(imdb_id, 'subtitles');
  if (!fs.existsSync(subtitlesDir)) {
    fs.mkdirSync(subtitlesDir, { recursive: true });
  }
  const subslinks = await scrapeYifySubtitles(imdb_id);

  const subs = await downloadAndExtractAll(subslinks, subtitlesDir);
  const subsInfo = await Promise.all(
    subs.map(async (sub) => {
      // Full path to the original subtitle
      const filePath = sub.filePath;
      const filename = path.basename(filePath);
      // e.g. ".srt" or ".vtt"
      const ext = path.extname(filePath).toLowerCase();

      // Probe to see if a language is tagged
      const langCode = getLangCodeFromFilename(filename);

      // Construct new file name: basename + . + lang + .vtt
      const base = path.basename(filePath, ext); // strip original extension
      const outputFilename = `${base}.${langCode}.vtt`;
      const outputPath = path.join(subtitlesDir, outputFilename);

      // If it's already .vtt, just copy it. Otherwise, convert.
      if (ext !== '.vtt') {
        await convertToWebVTT(filePath, outputPath);
        fs.unlinkSync(filePath);
        // console.log(`Converted ${filePath} => ${outputFilename}`);
      } else {
        fs.copyFileSync(filePath, outputPath);
        // console.log(`Copied ${filePath} => ${outputFilename}`);
      }

      return { langCode, filePath: outputPath };
    })
  );
  return subsInfo;
}

function parseSize(sizeText: string): number {
  const size = sizeText.toUpperCase().replace(',', '.').trim();
  const match = size.match(/([\d.]+)\s*(KB|MB)/);

  if (!match) return 0;

  const value = parseFloat(match[1]);
  const unit = match[2];

  return unit === 'MB' ? value : value / 1024;
}

/**
 * Scrape subtitles list from yifysubtitles.ch by IMDb ID
 */
export async function scrapeYifySubtitles(imdbId: string): Promise<RemoteSubtitle[]> {
  const pageUrl = `https://yifysubtitles.ch/movie-imdb/${imdbId}`;
  const res = await fetch(pageUrl);
  if (!res.ok) {
    console.warn(`YIFY page returned ${res.status}`);
    return [];
  }

  const html = await res.text();
  const $ = cheerio.load(html);
  const subtitleMap: Record<string, RemoteSubtitle> = {};
  $('.other-subs .high-rating, .other-subs tbody tr').each((_, el) => {
    const lang = $(el).find('.sub-lang').text().trim();
    const ratingText = $(el).find('.rating-cell').text().trim();
    const href = $(el).find('a').attr('href');
    const sizeText = $(el).find('td:nth-child(4)').text().trim();

    const rating = parseFloat(ratingText) || 0;
    const sizeMb = parseSize(sizeText);
    //   if (lang && href) {
    //     subs.push({
    //       lang,
    //       rating,
    //       pageUrl: `https://yifysubtitles.ch${href}`,
    //     });
    //   }
    // });

    const existing = subtitleMap[lang];
    if (
      !existing ||
      rating > parseFloat(existing.rating || '0') ||
      (rating === parseFloat(existing.rating || '0') && sizeMb > (existing.sizeMb || 0))
    ) {
      subtitleMap[lang] = {
        lang,
        rating: rating.toString(),
        pageUrl: `https://yifysubtitles.ch${href}`,
        sizeMb,
      };
    }
  });
  const subs = Object.values(subtitleMap);

  return subs;
}

/**
 * Извлекает из страницы ссылку на реальный ZIP-файл
 */
async function resolveDownloadUrl(pageUrl: string): Promise<string> {
  const res = await fetch(pageUrl);
  if (!res.ok) throw new Error(`Failed to fetch ${pageUrl}: ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const link = $('a')
    .filter((_, el) => $(el).text().includes('DOWNLOAD SUBTITLE'))
    .attr('href');

  if (!link) {
    throw new Error(`Download link not found on page ${pageUrl}`);
  }
  return link.startsWith('http') ? link : new URL(link, pageUrl).toString();
}

/**
 * Download and extract remote subtitle zip into subtitlesDir
 */
export async function downloadAndExtractAll(
  subs: RemoteSubtitle[],
  subtitlesDir: string
): Promise<{ lang: string; filePath: string }[]> {
  // 1) Полностью очищаем папку (если она есть) и создаём заново
  if (fs.existsSync(subtitlesDir)) {
    fs.rmSync(subtitlesDir, { recursive: true, force: true });
  }
  fs.mkdirSync(subtitlesDir, { recursive: true });

  const results: { lang: string; filePath: string }[] = [];

  await Promise.all(
    subs.map(async (sub) => {
      try {
        // 2) Получаем ZIP как Buffer
        const zipUrl = await resolveDownloadUrl(sub.pageUrl);
        const res = await fetch(zipUrl);
        if (!res.ok) {
          throw new Error(`Failed to download ${zipUrl}: ${res.status}`);
        }
        const arrayBuffer = await res.arrayBuffer();
        const zipBuffer = Buffer.from(arrayBuffer);

        // 3) Парсим ZIP и находим entry с нужным расширением
        const directory = await unzipper.Open.buffer(zipBuffer);
        const entry = directory.files.find((file) => {
          const ext = path.extname(file.path).toLowerCase();
          return ['.srt', '.vtt', '.sbv', '.ttml'].includes(ext);
        });

        if (!entry) {
          throw new Error(`No subtitle file found in ${zipUrl}`);
        }

        // 4) Пишем его в subtitlesDir, сохраняя оригинальное имя из ZIP
        const outputPath = path.join(subtitlesDir, path.basename(entry.path));
        await new Promise<void>((resolve, reject) => {
          entry
            .stream()
            .pipe(fs.createWriteStream(outputPath))
            .on('finish', resolve)
            .on('error', reject);
        });

        results.push({ lang: sub.lang, filePath: outputPath });
      } catch (err) {
        console.warn(`❌ ${sub.lang} failed: ${(err as Error).message}`);
      }
    })
  );

  return results;
}

function convertToWebVTT(inputPath: string, outputPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const command = (ffmpeg as any)(inputPath);
    command
      .outputOptions('-c:s webvtt') // instruct ffmpeg to convert SRT -> WebVTT
      .save(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (error: Error) => reject(error));
  });
}

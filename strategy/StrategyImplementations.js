import { Strategy } from "./Strategy.js";

import cheerio from 'cheerio';

export const findNumberByKeywordsStrategy = new Strategy('number', (...args) => findNumberByKeywords(...args));
export const findNumberByTagStrategy = new Strategy('number', (...args) => findNumberByTags(...args));



function findNumberByTags(details) {
  const { cheerioElements, regexExpTarget } = details;
  const maximumTagDataLength = 30;
  const findUnwantedCharsRegex = '[^0-9 ]';

  let sanitisedPhoneNumbers = [];
    cheerioElements('p, span').each((i, elem) => {
      const data = cheerioElements(elem).text();
      if(data.length < maximumTagDataLength){
        const sanitizedData = sanitizeData(data, findUnwantedCharsRegex);
        if (sanitizedData.length > 0) {
          const phoneNumbers = splitIntoPhoneNumbers(sanitizedData);
          sanitisedPhoneNumbers = [...sanitisedPhoneNumbers, ...phoneNumbers];
        }
      }
    });
    return sanitisedPhoneNumbers;
}

function sanitizeData(data, findUnwantedCharsRegex) {
  const unwantedCharsRegexExp = new RegExp(findUnwantedCharsRegex, 'g');
  return data.replace(unwantedCharsRegexExp, '');
}

function splitIntoPhoneNumbers(sanitizedData) {
  const phoneNumbers = sanitizedData.split(' ');
  return phoneNumbers.filter(number => number !== '');
}


function extractTagsFromHTML(details) {
  const { html, tags } = details;
  const $ = cheerio.load(html);
  const results = {};

  tags.forEach(tag => {
    const elements = $(tag);
    const extractedData = [];

    elements.each((index, element) => {
      extractedData.push($(element).text());
    });

    results[tag] = extractedData;
  });

  return results;
}

function findNumberByKeywords(details) {
  const { tags, keywords } = details;
  const results = [];

  tags.forEach(tag => {
    const value = tag.trim();
    if (value.length < 50 && containsAnyKeyword(value, keywords)) {
      const extractedNumbers = value.replace(/[^0-9]/g, '');
      if (extractedNumbers) {
        results.push(extractedNumbers);
      }
    }
  });

  return results;
}

export function findTagsWithHref($) {
  const hrefTags = [];
  $('*').each((index, element) => {
    const tag = $(element).prop('tagName');
    const href = $(element).attr('href');
    if (href) {
      hrefTags.push(tag);
    }
  });
  return hrefTags;
}

export function containsAnyKeyword(value, keywords) {
  const lowercasedValue = value.toLowerCase();
  return keywords.some(keyword => lowercasedValue.includes(keyword.toLowerCase()));
}
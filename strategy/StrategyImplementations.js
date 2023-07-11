import { Strategy } from "./Strategy.js";

import cheerio from 'cheerio';

export const findNumberByKeywordsStrategy = new Strategy('number', (...args) => findNumberByKeywords(...args));
export const findNumberByTagStrategy = new Strategy('number', (...args) => findTargetByTag(...args));
export const findAddressByTagStrategy = new Strategy('address', (...args) => findTargetByTag(...args));
export const findSocialMediaByTagStrategy = new Strategy('links', (...args) => findTargetByTag(...args));


export function findTargetByTag(tags, regexExpTarget){
  const results = [];
  tags.forEach(tag => {
    const matches = tag.match(regexExpTarget);
    if (matches) {
      results.push(matches[0]);
    }
  });
  return results;
}



export function extractTagsFromHTML(html, tags) {
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

export function findNumberByKeywords(tags, keywords) {
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
  
  function containsAnyKeyword(value, keywords) {
    const lowercasedValue = value.toLowerCase();
    return keywords.some(keyword => lowercasedValue.includes(keyword.toLowerCase()));
  }
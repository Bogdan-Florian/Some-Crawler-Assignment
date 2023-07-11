
import { findAddressByTagStrategy, findNumberByTagStrategy, findNumberByKeywordsStrategy, findSocialMediaByTagStrategy } from './strategy/StrategyImplementations.js'

const tags = [
    '<p>Some text with a number: 123</p>',
    '<span>Phone: +1 (123) 456-7890</span>',
    '<div><p>Another paragraph with a phone number: 987654321</p></div>'
  ];

const findAddressByTagStrategyValues = findNumberByTagStrategy.executeStrategy(['<p>555555</p>', '<span>11111-11111</span>'], ['\\d+']);
const findNumberByKeywordsValues = findNumberByKeywordsStrategy.executeStrategy(['<p>number:555555</p>', '<span>telephone 11111-11111</span>'], ['number', 'telephone']);
console.log(findNumberByKeywordsValues)
const fs = require('fs');
const path = require('path');

function tsvToJson(tsv) {
  const lines = tsv.trim().split('\n');
  const headers = lines[0].split('\t');
  return lines.slice(1).map(line => {
    const cols = line.split('\t');
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = cols[i] ? cols[i].trim().replace(/^"|"$/g, '') : '');
    return obj;
  });
}

function writeJsonp(filename, callbackName, data) {
  const js = `${callbackName}(${JSON.stringify({ entries: data }, null, 2)});`;
  fs.writeFileSync(filename, js);
}

// Talks
const talksTsv = fs.readFileSync(path.join(__dirname, '..', 'db', 'talks.tsv'), 'utf8');
const talksData = tsvToJson(talksTsv);
writeJsonp(path.join(__dirname, '..', 'js', 'talks.js'), 'talksFeed', talksData);

// Outreach
const outreachTsv = fs.readFileSync(path.join(__dirname, '..', 'db', 'outreach.tsv'), 'utf8');
const outreachData = tsvToJson(outreachTsv);
writeJsonp(path.join(__dirname, '..', 'js', 'outreach.js'), 'outreachFeed', outreachData);

// Awards
const awardsTsv = fs.readFileSync(path.join(__dirname, '..', 'db', 'awards.tsv'), 'utf8');
const awardsData = tsvToJson(awardsTsv);
writeJsonp(path.join(__dirname, '..', 'js', 'awards.js'), 'awardsFeed', awardsData);

// Funding
const fundingTsv = fs.readFileSync(path.join(__dirname, '..', 'db', 'funding.tsv'), 'utf8');
const fundingData = tsvToJson(fundingTsv);
writeJsonp(path.join(__dirname, '..', 'js', 'funding.js'), 'fundingFeed', fundingData);

console.log('talks.js, outreach.js, awards.js, and funding.js generated.');
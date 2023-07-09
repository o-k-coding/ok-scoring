const path = require('path');
const fs = require('fs');

const rawTraceFilePath = path.join(__dirname, 'src/cmd/api/traces.json');
const jaegerTraceFilePath = path.join(__dirname, 'src/cmd/api/jaeger-traces.json');

const traceDataRaw = fs.readFileSync(rawTraceFilePath, 'utf8');


// First chunk from each { to each } and parse json into array
const traces = parseTraces(traceDataRaw);

// Camelcase each field in each object

// Nested array functions ew but I haven't used them in awhile so it feels nice :)
const camelizedTraces = camelizeTraces(traces)

// Create final data type
const jaegerDataRaw = JSON.stringify({
  data: camelizedTraces
});

// Write data to file
fs.writeFileSync(jaegerTraceFilePath, jaegerDataRaw, 'utf8');

function camelizeTraces(traces) {
  return traces.map(camelizeKeys)
}

function camelizeKeys(obj) {
  return Object.keys(obj).reduce(
    (camelizedTrace, key) => {
      let value = obj[key];
      if (value && typeof value === 'object') {
        value = camelizeKeys(value);
      }
      camelizedTrace[camelizeString(key)] = value;
      return camelizedTrace;
    },
    {}
  )
}

function camelizeString(s) {
  let camelized = s[0].toLowerCase();
  if (s.length > 1) {
    camelized += s.slice(1)
  }
  return camelized
}


function parseTraces(traceDataRaw) {
  const traces = [];
  let traceStartIndex = 0;
  let braceCount = 0;
  for (let i = 0; i < traceDataRaw.length; i++) {
    if (traceDataRaw[i] === '{') {
      if (braceCount === -1) {
        traceStartIndex = i;
      }
      braceCount++;
    }
    if (traceDataRaw[i] === '}') {
      braceCount--;
      // We found matching braces!
      if (braceCount === 0) {
        const parsedTrace = JSON.parse(traceDataRaw.slice(traceStartIndex, i + 1))
        traces.push(parsedTrace);
      }
    }
  }
  return traces;
}

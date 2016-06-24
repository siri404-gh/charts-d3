var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
require('colors');

var inputFile = process.argv[2] || 'dummy.csv';
var outputFile = process.argv[3] || 'dummy.json';

var instream = fs.createReadStream(inputFile);
var outstream = new stream;
var rl = readline.createInterface(instream, outstream);

var i = 1;
var indexArray = [];

var startTime;
var endTime;

var writeDataToFile = function(data, type) {
        var writeAction = type == 0? fs.writeFile : fs.appendFile;
        writeAction(outputFile, data, function(error) {
            if(error) console.error('Write error: '+ error.message.red);
        });
    };

var parser = function(data, requiredFields, criterion, customIndices) {
    if(i==1) {
        startTime = new Date().getTime();
        console.log(('Started Parsing at '+startTime+'us.').green);
        var indexArrayTemp = data.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        indexArrayTemp.forEach(function(index) {
            indexArray.push(index.replace(/['"]+/g, ''));
        });
    }
    else {
        var line = [];
        lineTemp = data.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        lineTemp.forEach(function(string) {
            line.push(string.replace(/['"]+/g, ''));
        });
        var newObj = {};
        requiredFields.forEach(function(field, i) {
            if (criterion(line)) {
                var index = customIndices? customIndices[requiredFields.indexOf(field)] : field;
                newObj[index] = line[indexArray.indexOf(field)];
            }
        });
        var data = JSON.stringify(newObj);
        if (data != '{}') {
            if(i==2) {
                writeDataToFile('\t\t'+data, 1);
            } else {
                writeDataToFile(',\n\t\t'+data, 1);
            }
        }
    }
    i++;
}

writeDataToFile('{\n\"data\":[\n', 0);

rl.on('close', function() {
    writeDataToFile('\n\t]\n}', 1);
    endTime = new Date().getTime();
    console.log(('Done parsing at '+endTime+'μs.').green);
    console.log(('Done in '+ (endTime - startTime)+'μs').green);
});

rl.on('line', function(data) {
    var requiredFields = ['Primary Type','Year','Description','Arrest'];
    var customIndices = ['t','y','v','a'];
    var criterion = function(line) {
        return ( ( line[17] >= 2001 && line[17]<= 2016 ) && ( ( line[5] == 'ASSAULT' ) || ( line[5] == 'THEFT' && ['OVER $500', '$500 AND UNDER'].indexOf(line[6] ) !== -1 ) ) )? true : false;
    };
    parser(data, requiredFields, criterion, customIndices);
});

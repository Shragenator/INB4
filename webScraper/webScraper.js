let cheerio = require('cheerio')
//let $ = cheerio.load("HTML DOM to load") // See Cheerio API
let jsonframe = require('jsonframe-cheerio');
jsonframe($); // initializes the plugin

//let $ = cheerio.load('http://www.huffingtonpost.com/entry/hurricane-irma-barbuda_us_59b08f6ce4b0dfaafcf544c9?ncid=inblnkushpmg00000009')   for testing if not using CSV reader

fs = require('fs')          
fs.readFile('/urlCSV', 'utf8', function (err,data) {       
    if (err) {
        return console.log(err);
    }
    console.log(data);
});


function parseCSV(str) {
    var arr = [];
    var quote = false;  // true means we're inside a quoted field

    // iterate over each character, keep track of current row and column (of the returned array)
    for (var row = col = c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c + 1];        // current character, next character
        arr[row] = arr[row] || [];             // create a new row if necessary
        arr[row][col] = arr[row][col] || '';   // create a new column (start with empty string) if necessary

        // If the current character is a quotation mark, and we're inside a
        // quoted field, and the next character is also a quotation mark,
        // add a quotation mark to the current column and skip the next character
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }

        // If it's just one quotation mark, begin/end quoted field
        if (cc == '"') { quote = !quote; continue; }

        // If it's a comma and we're not in a quoted field, move on to the next column
        if (cc == ',' && !quote) { ++col; continue; }

        // If it's a newline and we're not in a quoted field, move on to the next
        // row and move to column 0 of that new row
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }

        // Otherwise, append the current character to the current column
        arr[row][col] += cc;
    }
    return arr;
}


urlArr = parseCSV(data);

while (urlArr.hasnext()) {
    let $ = cheerio.load(urlArr.value)
    
    var frame = {
        "article": {           // setting the parent item as "article"
            "selector": ".item",    // defines the elements to search for
            "data": [{              // "data": [{}] defines a list of items
                "title": ".header [itemprop=name]",          // inline selector defining "name" so "article"."name"
                "description": ".header [rel=description]", // inline selector defining "description" as "article"."description"
                "date": ".date || \\d{1,2}/\\d{1,2}/\\d{2,4}",     //inline date/time using regex
                "time": ".time || /([01]\d|2[0-3]):([0-5]\d)/",
              
                "CONTENT": ".content || ^(?=.*?[A-Z])(?=.*?[a-z])(.).{30,}$",           //regex check to make sure hte content found somewhat resembles an article <MAKE SURE IT INCLUDES WHITESPACES>
              
                "url": {                                    // defining "url" by an attribute with "attr" and "selector" in an object
                    "selector": ".header [itemprop=name]",      // is actually the same as the inline selector
                    "attr": "href"                              // the attribute name to retrieve
                },
                "author": {                                // set up a parent "author" element as "article"."author"
                    "selector": ".contact",                 // defines the element to search for
                    "data": {                               // defines the data which "author" will contain
                        "name": {                          
                            "selector": "[itemprop=name]",     // simple selector for name <FIND CORRECT ONE HERE>         
                            "type": "name"                     // FINE a name parser to use
                        },
                        "email": {                          // using "type" to use "email" parser to extract only the email
                            "selector": "[itemprop=email]",     // simple selector for "email"
                            "type": "email"                     // using "email" plugin parser
                        },
                        "employeeOf": {                           // setting a parent node "employeeOf" as "article"."author"."employeeOf"      // in case we need something else nested here
                            "newscompany": "[itemprop=newscompany]",          // inline selector defining "newscompany"            <<MAKE SURE CORRECT>>
                            "jobTitle": "[itemprop=employeeJobTitle]",  // inline selector defining "jobtitle"
                            
                        }
                    }
                }
            }]
        }

    };

    var news = $('.list.items').scrape(frame);
    console.log(newsData);

}
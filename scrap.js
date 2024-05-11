const path = require("path");
const writeXlsxFile = require("write-excel-file/node");
const cheerio = require("cheerio");
const axios = require("axios");
const URL = "http://books.toscrape.com/index.html";
const filepath = path.join(__dirname, "excel.xlsx");
async function getWeb() {
  let res = await axios.get(URL);
  return res;
}
const Book = () => ({
  title: "",
  price: "",
  availability: "",
});
const bookList = [],
  Data = [];
async function scrap() {
  const web = await getWeb();
  const $ = cheerio.load(web.data);
  //Getting Titles...
  $("article>h3>a").each((idx, ele) => {
    const book = Book();
    book.title = ele.attribs.title;
    bookList.push(book);
  });
  //Getting Prices...
  $("article>.product_price>.price_color").each(
    (idx, ele) => (bookList[idx].price = $(ele).text()),
  );
  //Getting Stock Availability..
  $("article>.product_price>.instock ").each(
    (idx, ele) => (bookList[idx].availability = $(ele).text().trim()),
  );
  //writing data to excel file...
  let r = await writeXlsxFile(bookList, {
    schema,
    filePath: filepath,
  });
}
scrap();
// schema for excel data..
const schema = [
  {
    column: "PRODUCT(book)",
    type: String,
    value: (book) => book.title,
  },
  {
    column: "PRICE",
    type: String,
    value: (book) => book.price,
  },
  {
    column: "AVAILABILITY(book)",
    type: String,
    value: (book) => book.availability,
  },
];
console.log(__dirname);

const HEADER = [
  {
    value: "PRODUCT(book)",
  },
  {
    value: "PRICE",
  },
  {
    value: "AVAILABILITY(book)",
  },
];

// const fs = require('fs');
// const Pinboard = require('pinboard-bookmarks');

// module.exports = () => {

//   require('dotenv').config();

//   const pinboard = new Pinboard(process.env.PINBOARD_API);

//   pinboard.bookmarks({ results: 1000 })
//     .then((bookmarks) => {

//       // console.log(bookmarks);

//       var bookmarks = bookmarks;

//       fs.writeFile(__dirname + '/../dev/pinboard.json', JSON.stringify(bookmarks), err => {
//         if(err) {
//           console.log(err);
//         } else {
//           console.log("Updated pinboard.json");
//         }
//       });

//     })
//     .catch((error) => {
//       console.log('Something went wrong!', error);
//     });
// }

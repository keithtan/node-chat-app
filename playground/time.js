var moment = require('moment');

// var date = new Date();
// var months = ['Jan', 'Feb'];
// console.log(date.getMonth);

var someTime = moment().valueOf();
console.log(someTime);

var createdAt = 1234;
var date = moment(createdAt);
console.log(date.format('MMM Do YYYY'));
console.log(date.format('hh:mm a'));
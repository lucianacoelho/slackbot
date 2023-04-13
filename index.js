const { App } = require("@slack/bolt");
require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2');
const PDFDocument = require("pdfkit-table");

let token = "xoxb-4248656851431-4260526979909-sJs9bwq975wqTEeOsGjRfI4W"
let secret = "971ddbb44561bc5d78f6aa07cc0fdef7"
let app_token = "xapp-1-A047R3UB6GK-4276269730545-3ad5ebc052c22ceface05cf60d51e10c70c0ea666f55d5b65a0becec74d2afb9"
// create the connection to database
const con = mysql.createConnection({
  host: 'ppslackappv2.czovis8lcihq.us-east-2.rds.amazonaws.com',
  user: 'coelhodb',
  password: 'abcd1234',
  database: 'ppslackappv2'
});

if (con) {
  console.log('connected');
};

// connects with slack
const app = new App({
  token: token, //Find in the Oauth  & Permissions tab
  signingSecret: secret, // Find in Basic Information Tab
  socketMode: true,
  appToken: app_token // Token from the App-level Token that we created
});

//saves the thread into the database
app.message('#save', async ({ message, say }) => {
  // await say(`Hello, <@${message.user}>`);
  if (message.thread_ts) {

    result = await app.client.conversations.replies({
      token: token,
      channel: message.channel,
      ts: message.thread_ts
    });

    link = await app.client.
      chat.getPermalink({
        token: token,
        channel: message.channel,
        message_ts: message.ts
      });

    getWhoAskedInfo = await app.client.users.info({
      token: token,
      user: result.messages[0].user
    });


    let date = new Date();

    let pst = date.toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
    });

    getWhoSavedInfo = await app.client.users.info({
      token: token,
      user: `${message.user}`
    });

    fs.appendFileSync('file.txt', `Question: #${result.messages[1].thread_ts}, saved at ${pst}, by ${getWhoSavedInfo.user.real_name}.`, err => {
      if (err) {
        throw err;
      }
    });

    fs.appendFileSync('file.txt', '\n', err => {
      if (err) {
        throw err;
      }
    });
    fs.appendFileSync('file.txt', '\n', err => {
      if (err) {
        throw err;
      }
    });

    fs.appendFileSync('file.txt', `Link to thread: ${link.permalink}`, err => {
      if (err) {
        throw err;
      }
    });

    fs.appendFileSync('file.txt', '\n', err => {
      if (err) {
        throw err;
      }
    });
    fs.appendFileSync('file.txt', '\n', err => {
      if (err) {
        throw err;
      }
    });

    fs.appendFileSync('file.txt', `${getWhoAskedInfo.user.real_name} (${getWhoAskedInfo.user.profile.email}) asked: \n "${result.messages[0].text}."`, err => {
      if (err) {
        throw err;
      }

    });

    fs.appendFileSync('file.txt', '\n', err => {
      if (err) {
        throw err;
      }
    });
    fs.appendFileSync('file.txt', '\n', err => {
      if (err) {
        throw err;
      }
    });

    fs.appendFileSync('file.txt', `Here are all the answers selected as "useful":`, err => {
      if (err) {
        throw err;
      }
    });


    fs.appendFileSync('file.txt', '\n', err => {
      if (err) {
        throw err;
      }
    });
    fs.appendFileSync('file.txt', '\n', err => {
      if (err) {
        throw err;
      }
    });
    let thread = result.messages[1].thread_ts;
    con.query(`DELETE FROM slackapp WHERE thread='${thread}';`);
          console.log("DELETED");

    for (i = 0; i < Object.keys(result.messages).length; i++) {

      getWhoAnsweredInfo = await app.client.users.info({
        token: token,
        user: result.messages[i].user
      });


      // console.log("got to the if")

      if (result.messages[i].reactions && result.messages[i].reactions[0]["name"] == 'white_check_mark') {

        let line3 = `${getWhoAnsweredInfo.user.real_name} (${getWhoAnsweredInfo.user.profile.email}) replied: \n "${result.messages[i].text}."`;

        fs.appendFileSync('file.txt', line3, 'utf-8', err => {
          if (err) {
            throw err;
          }
        });

        fs.appendFileSync('file.txt', '\n', err => {
          if (err) {
            throw err;
          }
        });

        fs.appendFileSync('file.txt', '\n', err => {
          if (err) {
            throw err;
          }
        });




        // simple query

        con.connect(function (err) {
          let thread = result.messages[1].thread_ts;
          let date = pst;
          let threadLink = link.permalink;
          let questionAuthor = getWhoAskedInfo.user.real_name;
          let questionAuthorEmail = getWhoAskedInfo.user.profile.email;
          let question = result.messages[0].text;
          let answerAuthor = getWhoAnsweredInfo.user.real_name;
          let answerAuthorEmail = getWhoAnsweredInfo.user.profile.email;
          let answer = result.messages[i].text;
          let savedBy = getWhoSavedInfo.user.real_name;
          let reactions = result.messages[i].reactions[0]["count"];

       

          if (err) throw err;

          console.log("Connected!");
      
          
          con.query('INSERT INTO slackapp (date, thread, threadLink, questionAuthor, questionAuthorEmail, question, answerAuthor, answerAuthorEmail, answer, savedBy, reactions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [date, thread, threadLink, questionAuthor, questionAuthorEmail, question, answerAuthor, answerAuthorEmail, answer, savedBy, reactions]);
          console.log("RE-INSERTED");

        });
      };
    }
  };
});

//retrieves answers based on tags (limit of 10)
app.message('#?', async ({ message, say }) => {
  try {

    const tags = message.text.split(" ");

    let tagSize = tags.length - 1;

    console.log(tagSize);

    // console.log(typeof tagSize);

    let keyword1 = tags[0];
    let keyword2 = tags[1];
    let keyword3 = tags[2];
    let keyword4 = tags[3];
    let keyword5 = tags[4];
    let keyword6 = tags[5];
    let keyword7 = tags[6];
    let keyword8 = tags[7];
    let keyword9 = tags[8];
    let keyword10 = tags[9];

    switch (tagSize) {
      case 1:
        sql = ("SELECT answer FROM slackapp WHERE question LIKE '%" + keyword1 + "%' ORDER BY reactions DESC LIMIT 3");
        break;
      case 2:
        sql = ("SELECT answer FROM slackapp WHERE question LIKE '%" + keyword1 + "%' AND question LIKE '%" + keyword2 + "%' ORDER BY reactions DESC LIMIT 3");
        break;
      case 3:
        sql = ("SELECT answer FROM slackapp WHERE question LIKE '%" + keyword1 + "%' AND question LIKE '%" + keyword2 + "%' AND question LIKE '%" + keyword3 + "%' ORDER BY reactions DESC LIMIT 3");
        break;
      case 4:
        sql = ("SELECT answer FROM slackapp WHERE question LIKE '%" + keyword1 + "%' question LIKE AND '%" + keyword2 + "%' AND question LIKE '%" + keyword3 + "%' AND question LIKE '%" + keyword4 + "%' ORDER BY reactions DESC LIMIT 3");
        break;
      case 5:
        sql = ("SELECT answer FROM slackapp WHERE question LIKE '%" + keyword1 + "%' AND question LIKE '%" + keyword2 + "%' AND question LIKE '%" + keyword3 + "%' AND question LIKE '%" + keyword4 + "%' AND question LIKE '%" + keyword5 + "%' ORDER BY reactions DESC LIMIT 3");
        break;
      case 6:
        sql = ("SELECT answer FROM slackapp WHERE question LIKE '%" + keyword1 + "%' AND question LIKE '%" + keyword2 + "%' AND question LIKE '%" + keyword3 + "%' AND question LIKE '%" + keyword4 + "%' AND question LIKE '%" + keyword5 + "%' AND question LIKE '%" + keyword6 + "%' ORDER BY reactions DESC LIMIT 3");
        break;
      case 7:
        sql = ("SELECT answer FROM slackapp WHERE question LIKE '%" + keyword1 + "%' AND question LIKE '%" + keyword2 + "%' AND question LIKE '%" + keyword3 + "%' AND question LIKE '%" + keyword4 + "%' AND question LIKE '%" + keyword5 + "%' AND question LIKE '%" + keyword6 + "%' AND question LIKE '%" + keyword7 + "%' ORDER BY reactions DESC LIMIT 3");
        break;
      case 8:
        sql = ("SELECT answer FROM slackapp WHERE question LIKE '%" + keyword1 + "%' AND question LIKE '%" + keyword2 + "%' AND question LIKE '%" + keyword3 + "%' AND question LIKE '%" + keyword4 + "%' AND question LIKE '%" + keyword5 + "%' AND question LIKE '%" + keyword6 + "%' AND question LIKE '%" + keyword7 + "%' AND question LIKE '%" + keyword8 + "%' ORDER BY reactions DESC LIMIT 3");
        break;
      case 9:
        sql = ("SELECT answer FROM slackapp WHERE question LIKE '%" + keyword1 + "%' AND question LIKE '%" + keyword2 + "%' AND question LIKE '%" + keyword3 + "%' AND question LIKE '%" + keyword4 + "%' AND question LIKE '%" + keyword5 + "%' AND question LIKE '%" + keyword6 + "%' AND question LIKE '%" + keyword7 + "%' AND question LIKE '%" + keyword8 + "%' AND question LIKE '%" + keyword9 + "%' ORDER BY reactions DESC LIMIT 3");
        break;
      case 10:
        sql = ("SELECT answer FROM slackapp WHERE question LIKE '%" + keyword1 + "%' AND question LIKE '%" + keyword2 + "%' AND question LIKE '%" + keyword3 + "%' AND question LIKE '%" + keyword4 + "%' AND question LIKE '%" + keyword5 + "%' AND question LIKE '%" + keyword6 + "%' AND question LIKE '%" + keyword7 + "%' AND question LIKE '%" + keyword8 + "%' AND question LIKE '%" + keyword9 + "%' AND question LIKE '%" + keyword10 + "%' ORDER BY reactions DESC LIMIT 3");
        break;
      default:
      // code block
    }

    console.log(sql);



   con.query(sql, function (err, result) {



async function sort() {
  try {
    await say(`Search: "${message.text}".`);
    if (err) throw err;
      for (i = 0; i < result.length; i++) {
        let answers = [];
        answers.push(result[i].answer);
        // console.log(result[i].answer)
        console.log(answers);
       
      await say(`*This is the #${i+1} most voted answer: "*${answers}.*"`);
        
      
      };

  } catch (error) {
    console.log(error);
  }
}

sort();
  
    });



  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

//generates a pdf file with all entries in the DB
app.message("#faq", async ({ message, say }) => {

  let doc = new PDFDocument({ margin: 70, size: 'A4' });
  let sql = "SELECT * FROM slackapp ORDER BY id DESC;";
  con.query(sql, function (err, result) {

    if (err) throw err;
    // console.log(result); 
    // let cond = result.length +1;
    for (i = 0; i < result.length; i++) {
      // let id = result[i].id;
      let date = JSON.stringify(result[i].date);
      let thread = JSON.stringify(result[i].thread);
      let tLink = JSON.stringify(result[i].threadLink);
      let qAuthor = JSON.stringify(result[i].questionAuthor);
      let qAuthorEmail = JSON.stringify(result[i].questionAuthorEmail);
      let question = JSON.stringify(result[i].question);
      let aAuthor = JSON.stringify(result[i].answerAuthor);
      let aAuthorEmail = JSON.stringify(result[i].answerAuthorEmail);
      let answer = JSON.stringify(result[i].answer);
      let savedBy = JSON.stringify(result[i].savedBy);
      let reactions = JSON.stringify(result[i].reactions);

      
      doc.pipe(fs.createWriteStream("PayPal SMARTSCOUT Latest FAQ.pdf"));

      doc.moveDown();

      // -----------------------------------------------------------------------------------------------------
// Simple Table with Array
// -----------------------------------------------------------------------------------------------------
const tableArray = {
  headers: ["Question", question],
  rows: [
    ["Question #:", thread.replaceAll('"','')],
    ["Saved by:", savedBy.replaceAll('"','')],
    ["At", date.replaceAll('"','')],
    ["Asked by:", qAuthor.replaceAll('"','')],
    ["Email:", qAuthorEmail.replaceAll('"','')],
  ],
};
doc.table( tableArray, { width: 250, columnsSize: [ 150, 300 ] }); // A4 595.28 x 841.89 (portrait) (about width sizes)

// move to down
doc.moveDown(); // separate tables

      const tableArrayColor = {
        headers: ["This answer was selected as relevant:", answer],
        rows: [
          ["This answer was given by:", aAuthor.replaceAll('"','')],
          ["Email:", aAuthorEmail.replaceAll('"','')],
          // ["Selected as useful by ", reactions + " people."],
          ["Slack thread link:", tLink.replaceAll('"','')],
        ],
      };

      doc.table(tableArrayColor, {
        width: 600,
        x: null,
        columnsSize: [150, 300],
        prepareRow: (row, indexColumn, indexRow, rectRow) => {

          doc.font("Helvetica").fontSize(8);
          indexColumn === 0 && doc.addBackground(rectRow, (indexRow % 2 ? 'skyblue' : 'skyblue'), 0.5);
          doc.moveDown();
        },

      });
      doc.addPage();
    };
    doc.end();
  });



  await say(`<@${message.user}>,I just sent the lastest FAQ file to our private chat :)`);


  await app.client.files.upload({

    token: token,
    file: fs.createReadStream('PayPal SMARTSCOUT Latest FAQ.pdf'),
    channels: message.user
  });
  // //uncomment
});

app.start(3000)
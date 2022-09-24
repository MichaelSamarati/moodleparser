require("dotenv").config();
const axios = require("axios");
const email = require("./email");

run();

var items = [];

async function run() {
  console.log("Started!");
  while (true) {
    try {
      const response = await fetchUrl();
      console.log("1");
      const relevantText = response.data.match(
        /(id="month-upcoming)(.|\n)*(Zum Kalender)/
      )[0];
      console.log("2232");
      let aTags = relevantText.match(/((<a)((.|\\n)*?)<\/a>)/g);
      let currentItems = [];
      console.log("11");
      for (let i = 0; i < aTags.length; i += 2) {
        const name = aTags[i].split(">")[1].split("<")[0];
        const hrefText = aTags[i].match(/(href="((.|\n)*?)")/)[0];
        const url = hrefText.split('"')[1];
        const time = aTags[i + 1].split(">")[1].split("<")[0];
        let item = { name, time, url };
        currentItems = [...currentItems, item];
      }
      console.log("2");
      currentItems.map((x) => {
        if (!items.find((y) => y.name == x.name)) {
          console.log(x.name);
          sendEmail(
            "michael.samarati@gmail.com",
            x.name,
            x.name + "\n" + x.time + "\n" + x.url
          );
          items = [...items, x];
        }
        return x;
      });
    } catch (e) {}
    sleep(10000, () => yoo());
  }
}

async function fetchUrl() {
  try {
    let response = await axios(
      // "https://moodle.htl-donaustadt.at/my/index.php",
      // {
      //   headers: {
      //     accept:
      //       "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      //     "accept-language":
      //       "de-AT,de;q=0.9,en-US;q=0.8,en;q=0.7,ru-RU;q=0.6,ru;q=0.5,de-DE;q=0.4",
      //     "cache-control": "max-age=0",
      //     "sec-ch-ua":
      //       '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
      //     "sec-ch-ua-mobile": "?0",
      //     "sec-ch-ua-platform": '"Windows"',
      //     "sec-fetch-dest": "document",
      //     "sec-fetch-mode": "navigate",
      //     "sec-fetch-site": "same-site",
      //     "upgrade-insecure-requests": "1",
      //     cookie:
      //       "MOODLEID1_=%25FD%25D7%2524%25D9%253F%2583; MoodleSession=t94lh1prgq9p7d3cqa16al6sp2; MDL_SSP_SessID=847a0dcde356ee678872dc5b8f3c1591; MDL_SSP_AuthToken=_22eef08f8e03a2e42e441429f9fc5e5878a569e426",
      //     Referer: "https://idp.htl-donaustadt.at/",
      //     "Referrer-Policy": "strict-origin-when-cross-origin",
      //   },
      //   body: null,
      //   method: "GET",
      // }
      "https://moodle.htl-donaustadt.at/my/",
      {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-language":
            "de-AT,de;q=0.9,en-US;q=0.8,en;q=0.7,ru-RU;q=0.6,ru;q=0.5,de-DE;q=0.4",
          "sec-ch-ua":
            '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          cookie:
            "MDL_SSP_SessID=847a0dcde356ee678872dc5b8f3c1591; MDL_SSP_AuthToken=_22eef08f8e03a2e42e441429f9fc5e5878a569e426; MoodleSession=gghrqp74jir18c746eg47uabo6; MOODLEID1_=%25FD%25D7%2524%25D9%253F%2583",
        },
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
      }
    );
    return await response;
  } catch (e) {
    console.log(e);
  }
}

async function sendEmail(to, subject, message) {
  var info = await email.sendEmail(
    "moodle.task.bot@gmail.com",
    to,
    subject,
    message
  );
  console.log(info);
}

function sleep(time, callback) {
  var stop = new Date().getTime();
  while (new Date().getTime() < stop + time) {}
  callback();
}

function yoo() {}

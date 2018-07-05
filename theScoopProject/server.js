// database is let instead of const to allow us to modify it in test.js
// let database = {
//   users: {},
//   articles: {},
//   nextArticleId: 1,
//   comments: {},
//   nextCommentId: 1
// };
// let database = {};

const fs = require("fs");
const yaml = require("yaml-js");

// Load database on server start
function loadDatabase() {
  fs.readFile("database.yaml", function(err, buf) {
    // Read yaml file and store it in database
    let readFile = buf.toString();
    database = yaml.load(readFile);
    console.log(database);
  });
}

// // Save database on updates
// function saveDatabase() {
//   // Write to yaml file on call
//   fs.writeFile("database.yaml", yaml.dump(database), function(err, database) {
//     if (err) console.log(err);
//     console.log("Database updated and saved!");
//   });
// }

const routes = {
  "/users": {
    POST: getOrCreateUser
  },
  "/users/:username": {
    GET: getUser
  },
  "/articles": {
    GET: getArticles,
    POST: createArticle
  },
  "/articles/:id": {
    GET: getArticle,
    PUT: updateArticle,
    DELETE: deleteArticle
  },
  "/articles/:id/upvote": {
    PUT: upvoteArticle
  },
  "/articles/:id/downvote": {
    PUT: downvoteArticle
  },
  "/comments": {
    POST: createComment
  },
  "/comments/:id": {
    PUT: updateComment,
    DELETE: deleteComment
  },
  "/comments/:id/upvote": {
    PUT: upvoteComment
  },
  "/comments/:id/downvote": {
    PUT: downvoteComment
  }
};

function getUser(url, request) {
  const username = url.split("/").filter(segment => segment)[1];
  const user = database.users[username];
  const response = {};

  if (user) {
    const userArticles = user.articleIds.map(
      articleId => database.articles[articleId]
    );
    const userComments = user.commentIds.map(
      commentId => database.comments[commentId]
    );
    response.body = {
      user: user,
      userArticles: userArticles,
      userComments: userComments
    };
    response.status = 200;
  } else if (username) {
    response.status = 404;
  } else {
    response.status = 400;
  }

  return response;
}

function getOrCreateUser(url, request) {
  const username = request.body && request.body.username;
  const response = {};

  if (database.users[username]) {
    response.body = { user: database.users[username] };
    response.status = 200;
  } else if (username) {
    const user = {
      username: username,
      articleIds: [],
      commentIds: []
    };
    database.users[username] = user;

    response.body = { user: user };
    response.status = 201;
  } else {
    response.status = 400;
  }

  return response;
}

function getArticles(url, request) {
  const response = {};

  response.status = 200;
  response.body = {
    articles: Object.keys(database.articles)
      .map(articleId => database.articles[articleId])
      .filter(article => article)
      .sort((article1, article2) => article2.id - article1.id)
  };

  return response;
}

function getArticle(url, request) {
  const id = Number(url.split("/").filter(segment => segment)[1]);
  const article = database.articles[id];
  const response = {};

  if (article) {
    article.comments = article.commentIds.map(
      commentId => database.comments[commentId]
    );

    response.body = { article: article };
    response.status = 200;
  } else if (id) {
    response.status = 404;
  } else {
    response.status = 400;
  }

  return response;
}

function createArticle(url, request) {
  const requestArticle = request.body && request.body.article;
  const response = {};

  if (
    requestArticle &&
    requestArticle.title &&
    requestArticle.url &&
    requestArticle.username &&
    database.users[requestArticle.username]
  ) {
    const article = {
      id: database.nextArticleId++,
      title: requestArticle.title,
      url: requestArticle.url,
      username: requestArticle.username,
      commentIds: [],
      upvotedBy: [],
      downvotedBy: []
    };

    database.articles[article.id] = article;
    database.users[article.username].articleIds.push(article.id);

    response.body = { article: article };
    response.status = 201;
  } else {
    response.status = 400;
  }

  return response;
}

function updateArticle(url, request) {
  const id = Number(url.split("/").filter(segment => segment)[1]);
  const savedArticle = database.articles[id];
  const requestArticle = request.body && request.body.article;
  const response = {};

  if (!id || !requestArticle) {
    response.status = 400;
  } else if (!savedArticle) {
    response.status = 404;
  } else {
    savedArticle.title = requestArticle.title || savedArticle.title;
    savedArticle.url = requestArticle.url || savedArticle.url;

    response.body = { article: savedArticle };
    response.status = 200;
  }

  return response;
}

function deleteArticle(url, request) {
  const id = Number(url.split("/").filter(segment => segment)[1]);
  const savedArticle = database.articles[id];
  const response = {};

  if (savedArticle) {
    database.articles[id] = null;
    savedArticle.commentIds.forEach(commentId => {
      const comment = database.comments[commentId];
      database.comments[commentId] = null;
      const userCommentIds = database.users[comment.username].commentIds;
      userCommentIds.splice(userCommentIds.indexOf(id), 1);
    });
    const userArticleIds = database.users[savedArticle.username].articleIds;
    userArticleIds.splice(userArticleIds.indexOf(id), 1);
    response.status = 204;
  } else {
    response.status = 400;
  }

  return response;
}

function upvoteArticle(url, request) {
  const id = Number(url.split("/").filter(segment => segment)[1]);
  const username = request.body && request.body.username;
  let savedArticle = database.articles[id];
  const response = {};

  if (savedArticle && database.users[username]) {
    savedArticle = upvote(savedArticle, username);

    response.body = { article: savedArticle };
    response.status = 200;
  } else {
    response.status = 400;
  }

  return response;
}

function downvoteArticle(url, request) {
  const id = Number(url.split("/").filter(segment => segment)[1]);
  const username = request.body && request.body.username;
  let savedArticle = database.articles[id];
  const response = {};

  if (savedArticle && database.users[username]) {
    savedArticle = downvote(savedArticle, username);

    response.body = { article: savedArticle };
    response.status = 200;
  } else {
    response.status = 400;
  }

  return response;
}

function upvote(item, username) {
  if (item.downvotedBy.includes(username)) {
    item.downvotedBy.splice(item.downvotedBy.indexOf(username), 1);
  }
  if (!item.upvotedBy.includes(username)) {
    item.upvotedBy.push(username);
  }
  return item;
}

function downvote(item, username) {
  if (item.upvotedBy.includes(username)) {
    item.upvotedBy.splice(item.upvotedBy.indexOf(username), 1);
  }
  if (!item.downvotedBy.includes(username)) {
    item.downvotedBy.push(username);
  }
  return item;
}

// Create function to create a new comment
// @route POST /comments
// Unsure why url is needed as parameter. However, function would not pass test cases without it being a parameter so have kept it in. Could possibly be issues with test cases?
function createComment(url, request) {
  // Initialise comment value by first checking body property exists in request and then assigning value stored in request.body.comment as value
  // Initialise response object
  const requestComment = request.body && request.body.comment;
  const response = {};

  // Check if requested comment exists &&
  // body property exists in requested comment &&
  // username property exists in requested comment &&
  // username exists in database.users object &&
  // articleId property exists in requested comment &&
  // article corresponding to comments articleId exists in databases.articles object
  if (
    requestComment &&
    requestComment.body &&
    requestComment.username &&
    database.users[requestComment.username] &&
    requestComment.articleId &&
    database.articles[requestComment.articleId]
  ) {
    // Test to check if statement entered
    // console.log("conditions met!");
    // Create comment with all specified properties provided
    const comment = {
      id: database.nextCommentId++,
      body: requestComment.body,
      username: requestComment.username,
      articleId: requestComment.articleId,
      upvotedBy: [],
      downvotedBy: []
    };

    // Assign created comment to database and push comments id value to commentId array in users and articles object within database
    database.comments[comment.id] = comment;
    database.users[comment.username].commentIds.push(comment.id);
    database.articles[requestComment.articleId].commentIds.push(comment.id);

    // Return created comment in response body
    response.body = { comment: comment };
    // Return successful POST status code
    response.status = 201;
  } else {
    // Test to check else statement entered
    // console.log("conditions not met!");
    // Returns unsuccessful POST status code
    response.status = 400;
  }

  return response;
}

// Create function to update an existing comment based on comment ID
// @route PUT /comments/:id
function updateComment(url, request) {
  // Split URL at "/"
  // Filter empty item at index 0 due to leading "/"
  // Return ID at index 1 (['comment', ':id']) and store in id variable
  const id = Number(url.split("/").filter(segment => segment)[1]);
  // Initialise savedComment and store comment from database.comments objects with corresponding ID extracted from URL
  // Initialise comment value by first checking request.body property exists and then assigning request.body.comment as value
  // Initialise response object
  const savedComment = database.comments[id];
  const requestComment = request.body && request.body.comment;
  const response = {};

  // Check if id or requestComment don't exist
  // else if check if comment exists at ID extracted from URL earlier
  // else update comments existing body property at provided ID with new comment held in body property of requestComment. If value in new body property is invalid maintain old comment.
  if (!id || !requestComment) {
    // Return bad request error code
    response.status = 400;
  } else if (!savedComment) {
    // Return not found error code
    response.status = 404;
  } else {
    savedComment.body = requestComment.body || savedComment.body;

    // Return updated comment in response body
    response.body = { comment: savedComment };
    // Return successful respones OK status code
    response.status = 200;
  }

  return response;
}

// Create function to delete an existing comment based on comment ID
// @route DELETE /comments/:id
function deleteComment(url, request) {
  // Split URL at "/"
  // Filter empty item at index 0 due to leading "/"
  // Return ID at index 1 (['comment', ':id']) and store in id variable
  const id = Number(url.split("/").filter(segment => segment)[1]);
  // Initialise savedComment (comment to delete)
  // Initialise response object
  const savedComment = database.comments[id];
  const response = {};

  if (/*id >= 0 &&*/ savedComment) {
    // Initialise variables to store array of comment IDs using ID for key corresponding to article and username for key corresponding to author, respectively.
    const articleCommentIds =
      database.articles[savedComment.articleId].commentIds;
    const userCommentIds = database.users[savedComment.username].commentIds;
    // Delete from database
    database.comments[id] = null;
    // Remove from article's comment IDs array
    articleCommentIds.splice(articleCommentIds.indexOf(id), 1);
    // Remove from author's comment IDs array
    userCommentIds.splice(userCommentIds.indexOf(id), 1);
    // Return DELETE Successful response code
    response.status = 204;
  } else {
    // Return error not found response code if savedComment not defined.
    response.status = 404;
  }

  return response;
}

// Create function to update upvotes of comment based on comment ID
// @route PUT /comments/:id/upvote
function upvoteComment(url, request) {
  // Split URL at "/"
  // Filter empty item at index 0 due to leading "/"
  // Return ID at index 1 (['comment', ':id']) and store in id variable
  const id = Number(url.split("/").filter(segment => segment)[1]);
  // Initialise username value by first checking body property exists in request and then assigning value stored in request.body.usernamel as value
  // Save corresponding comment from database at retrieved ID
  // Initialise response object
  const username = request.body && request.body.username;
  let savedComment = database.comments[id];
  const response = {};

  // Checks if comment exists in database at saved ID (this is also a check for valid ID) &&
  // Checks if username exists in database of users
  if (savedComment && database.users[username]) {
    // Call existing upvote function passing correct parameters, comment to upvote and username of upvoter. This is so a user can't upvote multiple times
    savedComment = upvote(savedComment, username);

    // Return updated comment in response body
    response.body = { comment: savedComment };
    // Return successful respones OK status code
    response.status = 200;
  } else {
    // Return bad request error code
    response.status = 400;
  }

  return response;
}

// Create function to update downvotes of comment based on comment ID
// @route PUT /comments/:id/downvote
function downvoteComment(url, request) {
  // Split URL at "/"
  // Filter empty item at index 0 due to leading "/"
  // Return ID at index 1 (['comment', ':id']) and store in id variable
  const id = Number(url.split("/").filter(segment => segment)[1]);
  // Initialise username value by first checking body property exists in request and then assigning value stored in request.body.username as value
  // Save corresponding comment from database at retrieved ID
  // Initialise response object
  const username = request.body && request.body.username;
  let savedComment = database.comments[id];
  const response = {};

  if (savedComment && database.users[username]) {
    // Call existing downvote function passing correct parameters, comment to downvote and username of downvoter. This is so a user can't downvote multiple times
    savedComment = downvote(savedComment, username);

    // Return updated comment in response body
    response.body = { comment: savedComment };
    // Return successful respones OK status code
    response.status = 200;
  } else {
    // Return bad request error code
    response.status = 400;
  }

  return response;
}

// Write all code above this line.

const http = require("http");
const url = require("url");

const port = process.env.PORT || 4000;
const isTestMode = process.env.IS_TEST_MODE;

const requestHandler = (request, response) => {
  const url = request.url;
  const method = request.method;
  const route = getRequestRoute(url);

  if (method === "OPTIONS") {
    var headers = {};
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = false;
    headers["Access-Control-Max-Age"] = "86400"; // 24 hours
    headers["Access-Control-Allow-Headers"] =
      "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
    response.writeHead(200, headers);
    return response.end();
  }

  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  if (!routes[route] || !routes[route][method]) {
    response.statusCode = 400;
    return response.end();
  }

  if (method === "GET" || method === "DELETE") {
    const methodResponse = routes[route][method].call(null, url);
    !isTestMode && typeof saveDatabase === "function" && saveDatabase();

    response.statusCode = methodResponse.status;
    response.end(JSON.stringify(methodResponse.body) || "");
  } else {
    let body = [];
    request
      .on("data", chunk => {
        body.push(chunk);
      })
      .on("end", () => {
        body = JSON.parse(Buffer.concat(body).toString());
        const jsonRequest = { body: body };
        const methodResponse = routes[route][method].call(
          null,
          url,
          jsonRequest
        );
        !isTestMode && typeof saveDatabase === "function" && saveDatabase();

        response.statusCode = methodResponse.status;
        response.end(JSON.stringify(methodResponse.body) || "");
      });
  }
};

const getRequestRoute = url => {
  const pathSegments = url.split("/").filter(segment => segment);

  if (pathSegments.length === 1) {
    return `/${pathSegments[0]}`;
  } else if (pathSegments[2] === "upvote" || pathSegments[2] === "downvote") {
    return `/${pathSegments[0]}/:id/${pathSegments[2]}`;
  } else if (pathSegments[0] === "users") {
    return `/${pathSegments[0]}/:username`;
  } else {
    return `/${pathSegments[0]}/:id`;
  }
};

if (typeof loadDatabase === "function" && !isTestMode) {
  const savedDatabase = loadDatabase();
  if (savedDatabase) {
    for (key in database) {
      database[key] = savedDatabase[key] || database[key];
    }
  }
}

const server = http.createServer(requestHandler);

server.listen(port, err => {
  if (err) {
    return console.log("Server did not start succesfully: ", err);
  }

  console.log(`Server is listening on ${port}`);
});

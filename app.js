import * as handlers from "./handlers.js";
import express from "express";
import bodyParser from "body-parser";
import {
  available_offers_search_validation_rules,
  reserve_validation_rules,
  sign_in_validation_rules,
  sign_up_validation_rules,
  validate,
} from "./validators.js";
import { sign_in, sign_up, user, logout } from "./auth.js";
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const ignore_auth = ["/available_offers", "/sign_up", "/sign_in"];

const get_user_from_auth = async function (token) {
    let user_result = await user();
    if (user_result.status !== 200){
        return -1;
    }
    return parseInt(user_result.body.userId);
};
const check_user = function (req, res, next) {
  if (ignore_auth.includes(req.url)) {
    next();
    return;
  }
  const token = req.headers["Token"];
  console.log(token);
  if (typeof token !== "undefined") {
    // let bearer = token.substring(7);
    let user_id = get_user_from_auth(token);
    if (user_id === -1) {
      res.status(400);
      res.send("invalid token");
    } else {
      req.USER = user_id;
      next();
    }
  } else {
    res.status(400);
    res.send("invalid token");
  }
};

// fine
// app.post("*", check_user);

// get a list of all airports
app.get("/airports", handlers.get_airports);

// test database connection
app.get("/runs", handlers.test_runs);

// get a list of all cities
app.get("/cities", handlers.get_cities);

// search for available offers
app.post(
  "/available_offers",
  available_offers_search_validation_rules(),
  validate,
  handlers.available_offers
);

// creates reserve tickets for flight
app.post(
  "/reserve_ticket",
  reserve_validation_rules(),
  validate,
  handlers.reserve_ticket
);

// client is redirected here when bank payment is done
app.get("/transaction_result/*", handlers.transaction_result);

app.post("/sign_up", sign_up_validation_rules(), validate, sign_up);

app.post("/sign_in", sign_in_validation_rules(), validate, sign_in);

app.post("/logout", logout);

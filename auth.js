import {validationResult} from "express-validator";
import axios from "axios";

const AUTH_URL = 'localhost:9000/'

const validation = function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
}

const server_error = function (error, res) {
    console.log(error);
    res.status(500).send("OOPS! something went wrong on our side...");
}

// sends a request to auth service and returns its answer
const proxy = async function (method, req) {
    let post_result = await axios.post('http://' + AUTH_URL + method, req);
    return post_result.data;
}

export const sign_up = async function (req, res) {
    try{
        let sign_up_result = await proxy('signUp/', req.body);
        res.send(sign_up_result);
    }catch (e) {
        server_error(e, res);
    }
}

export const sign_in = async function (req, res) {
    try{
        let sign_in_result = await proxy('signIn/', req.body);
        res.send(sign_in_result);
    }catch (e){
        server_error(e, res);
    }
}

export const user = async function (token){
    try {
        let req = {
            // probably needs change
            "url": "token",
            "token": token
        }
        let user_result = await proxy(req);
        return user_result.body.user_id;
    }catch (error){
        return -1;
    }
}

export const logout = function (req, res) {
    try {
        let logout_result = proxy(req);
        res.send(logout_result);
    } catch (error) {
        server_error(error, res);
    }
}
const db = require('../db.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = (req, res) => {

    const user_img = req.file?.filename || '';
    //CHECK EXISTING USER
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [req.body.email], (error, data) => {
        if (error) return res.status(500).json(error);

        if (data.length > 0) return res.status(409).json("User already exists");

        //Hash the password & create a user
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const sql = 'INSERT INTO users (name, email, mobile, password, user_img) VALUES (?,?,?,?,?)'
        const values = [req.body.name, req.body.email, req.body.mobile, hash, user_img];

        db.query(sql, values, (error, data) => {

            if (error) {
                console.log(error)
                return res.status(500).json(error);
            }
            // console.log(data);
            if (data.affectedRows > 0) return res.status(200).json("User has been created");
        });
    });

}

const login = (req, res) => {

    //CHECK USER

    const sql = 'SELECT * FROM users WHERE email = ?';

    db.query(sql, [req.body.email], (error, data) => {
        if (error) return res.status(409).json(error);

        if (data.length === 0) return res.status(404).json("User not found!");

        //CHECK PASSWORD

        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password);

        if (!isPasswordCorrect) return res.status(400).json("Wrong username or password!");

        const token = jwt.sign({ user_id: data[0].user_id }, "jwtkey", {
            expiresIn: '4h'
        });

        const { password, ...other } = data[0];

        res.cookie("access_token", token, {
            httpOnly: true
        }).status(200).json(other);
        console.log('Login successful');
    });
}

const logout = (req, res) => {
    res.clearCookie("access_token").status(200).json("User has been logged out.");
    console.log('logout')
}

module.exports = {
    register,
    login,
    logout
}

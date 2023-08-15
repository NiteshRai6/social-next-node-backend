const db = require('../db.js');
const jwt = require('jsonwebtoken');

const getPosts = (req, res) => {

    const sql = "SELECT post_id, post_des, post_img, post_date, post.user_id, users.user_id, name, user_img FROM users JOIN post ON users.user_id = post.user_id order by post_id DESC";

    db.query(sql, (error, data) => {
        if (error) return res.status(500).json(error);
        return res.json(data);
    })
}

const addPost = (req, res) => {

    const post_img = req.file?.filename || '';

    const token = req.cookies.access_token;
    if (!token) return res.status(401).json('Not Authenticated');

    jwt.verify(token, "jwtkey", (error, user) => {
        if (error) return res.status(403).json('Token is not valid');

        const sql = 'INSERT INTO post (post_des, post_img, post_date, user_id) VALUES (?,?,?,?)';
        // console.log(req.file);
        const values = [req.body.post_des, post_img, req.body.post_date, user.user_id];

        db.query(sql, values, (error, data) => {
            if (error) return res.status(500).json(error);
            // console.log(data);
            if (data.affectedRows > 0) return res.json("Post has been created");
        })
    })
}

const deletePost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json('Not Authenticated');

    jwt.verify(token, "jwtkey", (error, user) => {
        if (error) return res.status(403).json('Token is not valid');

        const sql = 'DELETE FROM post WHERE post_id = ? AND user_id = ? ';
        const values = [req.params.post_id, user.user_id];

        db.query(sql, values, (error, data) => {
            if (error) return res.status(403).json('You can delete only your post');

            return res.json('Post has been deleted');
        })
    })
}

const updatePost = (req, res) => {

    const post_img = req.file?.filename || '';

    const token = req.cookies.access_token;
    if (!token) return res.status(401).json('Not Authenticated');

    jwt.verify(token, "jwtkey", (error, user) => {
        if (error) return res.status(403).json('Token is not valid');

        const sql = 'UPDATE post SET post_des = ?, post_img = ? WHERE post_id = ? AND user_id = ?';

        const values = [req.body.post_des, post_img, req.params.post_id, req.body.user_id];

        db.query(sql, values, (error, data) => {
            if (error) return res.status(500).json(error);
            if (data.affectedRows > 0) return res.status(200).json("Post has been updated");
        })
    })
}

module.exports = {
    getPosts,
    addPost,
    deletePost,
    updatePost
}
// #Task route solution
const userModel = require('../Models/User');
const blogModel = require('../Models/Blog');
const { default: mongoose } = require('mongoose');

const createUser = async(req, res) => {
    const { name, email } = req.body;
    try {
        const user = await userModel.create({ name, email });
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getUsers = async(req, res) => {
    const users = await userModel.find({}).sort({ createdAt: -1 })

    for (let index = 0; index < users.length; index++) {
        const element = users[index];
        console.log(element.id);
    }
    res.status(200).json(users)
}

// create blog
const createBlog = async(req, res) => {
    /*
    1- get the title and body and authorId from the request body
    2- create a new blog with the title, body and authorId
    3- send the new blog as a response
    */
    const { title, body, authorId } = req.body;
    try {
        // Ensure the author exists
        const author = await userModel.findById(authorId);
        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }
        // Create the new blog
        const blog = await blogModel.create({ title, body, author: authorId });
        res.status(200).json(blog);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// filter blogs by author
const filterBlog = async(req, res) => {
    /*
    1- get the author id from the request query
    2- find all the blogs that have the same author id
    3- send the blogs as a response
    */
    const { authorid } = req.query;
    try {
        const blogs = await blogModel.find({ author: authorid }).populate('author', 'name email');
        if (blogs.length === 0) {
            return res.status(404).json({ error: 'No blogs found for this author' });
        }
        res.status(200).json(blogs);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


const editBlog = async(req, res) => {
    // TODO : edit the blog
    /*
    1- get the blog id from the request params
    2- get the new title and body from the request body
    3- update the blog with the new title and body
    4- send the updated blog as a response
    */
    const { blogId } = req.params;
    const { title, body } = req.body;
    try {
        const blog = await blogModel.findByIdAndUpdate(blogId, { title, body }, { new: true });
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


module.exports = { createUser, getUsers, createBlog, filterBlog, editBlog };
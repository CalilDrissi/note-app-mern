const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const  User = require('../models/User');
const  Note = require('../models/Note');


// @route GET   api/notes
//@desc         Get all users notes
//@access       private
router.get('/', auth, async (req, res)=>{
    try{
        const notes = await Note.find({user: req.user.id}).sort({date:-1});
        res.json(notes);
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});


//@route POST    api/notes
//@desc         add new note
//@access       private
router.post('/', [auth, [
    check('title', 'Title is required').not().isEmpty()
]], async (req, res) =>{

    const result = validationResult(req);

    if(!result.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {title, body} = req.body;

    try {
        const newNote = new Note({
            title,
            body,
            user: req.user.id
        });
        // saving to db
        const note = await newNote.save();
        res.json(note);
    } catch(err) {
        console.log(err.message);
        res.status(500).send('server error');
    }
});


//@route PUT   api/notes/:id
//@desc        Update existing note
//@access       private
router.put('/:id', auth, async (req, res)=>{
    const {title, body} = req.body;

    const noteFields = {};

    if(title) noteFields.title = title;
    if(body) noteFields.body = body;

    try {
         let note = await Note.findById(req.params.id);
         if(!note) return res.status(404).json({msg: 'note not found'});

         if(note.user.toString() !== req.user.id) {
             return res.status(401).json({msg: 'not authorized'});
         }
         note = await Note.findByIdAndUpdate(req.params.id, {$set: noteFields}, {new: true});
         res.json(note);
    } catch (err) {
     console.log(err.message);
     res.status(500).send('Server Error');
    }
});

//@route DELETE   api/notes/:id
//@desc           Delete note
//@access          Private
router.delete('/:id', auth, async (req, res)=>{
    try{
        let note = await Note.findById(req.params.id);
        if(!note) return res.status(404).json({msg: 'contact not found'});

        if(note.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'not authorized'});
        }

        await Note.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Contact removed'});
    } catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})


module.exports = router;
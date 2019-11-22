const express = require('express');
const Profile = require('./../../models/Profile');
const router = express.Router();
const User = require('./../../models/User');
const { check, validationResult } = require('express-validator');
const auth = require('./../../middleware/auth');

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

//@route    POST api/profile

// @desc    Create or update user profile

// @access  private

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.youtube = facebook;
    if (linkedin) profileFields.social.youtube = linkedin;
    if (instagram) profileFields.social.youtube = instagram;

    try {
      let profile = Profile.findOne({ user: req.user.id });
      // update
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true, useFindAndModify: false },

          err => {
            console.log('something wrong when updating data');
          }
        );
        console.log(profile + '1');

        return res.json(profile);
      }

      // create
      if (!profile) {
        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile);
        console.log(profile + '2');
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server Error');
    }
  }
);

module.exports = router;

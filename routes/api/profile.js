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
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      //create

      if (!profile) {
        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile);
      }

      // update
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true },

          err => {
            console.log('something wrong when updating data');
          }
        );

        return res.json(profile);
      }

      // create
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server Error');
    }
  }
);

//@route    GET api/profile

// @desc    GET all profile

// @access  public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ msg: 'server Error' });
  }
});

//@route    POST api/profile/user/:user_id

// @desc    Get profile by user id

// @access  public

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile)
      return res.status(400).json({ msg: 'there no profile for this user' });
    res.json(profile);
  } catch (e) {
    console.error(e.message);
    if (e.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'profile not found' });
    }
    res.status(500).json({ msg: 'server Error' });
  }
});

//@route    Delete api/profile

// @desc    Delete profile ,user &post

// @access  private

router.delete('/', auth, async (req, res) => {
  try {
    //@todo - remove users posts
    //Remove profile
    const profile = await Profile.findOne({ user: req.user.id });
    await Profile.findOneAndRemove({ _id: profile._id });
    //Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ msg: 'server Error' });
  }
});

//@route    PUT api/profile/experience

// @desc    Add profile experience

// @access  private

router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'title is required')
        .not()
        .isEmpty(),
      check('company', 'company is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
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
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      // console.log(req.user.id);
      const profile = await Profile.findOne({ user: req.user.id });
      // console.log(profile);
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (e) {
      console.error(e.message);
      res.status(500).send('server error');
    }
  }
);

//@route    DELETE api/profile/education:edu_id

// @desc    Delete experience from profile

// @access  private

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //get remove index
    const removeIndex = profile.experience
      .map(item => {
        item.id;
      })
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    profile.save();
    res.json(profile);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('server error');
  }
});

// @route    PUT api/profile/experience

// @desc    Add profile experience

// @access  private

router.put(
  '/education',
  [
    auth,
    [
      check('school', 'school is required')
        .not()
        .isEmpty(),
      check('degree', 'Deree is required')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'Field of study is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
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
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      // console.log(profile.education);
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (e) {
      console.error(e.message);
      res.status(500).send('server error');
    }
  }
);

// //@route    DELETE api/profile/experience:exp_id

// // @desc    Delete experience from profile

// // @access  private

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //get remove index
    const removeIndex = profile.education
      .map(item => {
        item.id;
      })
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    profile.save();
    res.json(profile);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('server error');
  }
});

module.exports = router;

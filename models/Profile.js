const moongoose = require('mongoose');

const ProfileSchema = new moongoose.Schema({
  user: {
    type: moongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  githubusername: {
    type: String
  },
  experience: [
    {
      title: {
        type: String,
        require: true
      },
      company: {
        type: String,
        require: true
      },
      location: {
        type: String
      },
      from: {
        type: String,
        require: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        require: false
      },
      description: {
        type: String
      }
    }
  ],
  education: [
    {
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      fieldofstudy: {
        type: String,
        required: true
      },
      from: {
        type: String,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = moongoose.model('profile', ProfileSchema);

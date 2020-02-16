import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getProfilesById } from './../../actions/profile';
import Spinner from './../layout/Spinner';
import ProfileTop from '../profileid/ProfileTop';
import ProfileExperience from '../profileid/ProfileExperience';
import ProfileEducation from '../profileid/ProfileEducation';
import ProfileGithub from '../profileid/ProfileGithub';
import ProfileAbout from '../profileid/ProfileAbout';
const Profile = ({
  getProfilesById,
  profile: { profileid, loading },
  auth,
  match
}) => {
  useEffect(() => {
    getProfilesById(match.params.id);
  }, [getProfilesById, match.params.id]);
  return (
    <Fragment>
      {profileid === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to='/profiles' className='btn btn-light'>
            Back To Profiles
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profileid.user._id && (
              <Link to='/edit-profile' className='btn btn-dark'>
                Edit Profile
              </Link>
            )}
          <div className='profile-grid my-1'>
            <ProfileTop profileid={profileid} />
            <ProfileAbout profileid={profileid} />
            <div className='profile-exp bg-white p-2'>
              <h2 className='text-primary'>Experience</h2>
              {profileid.experience.length > 0 ? (
                <Fragment>
                  {profileid.experience.map(experience => (
                    <ProfileExperience
                      key={experience._id}
                      experience={experience}
                    />
                  ))}
                </Fragment>
              ) : (
                <h4>No experience credentials</h4>
              )}
            </div>

            <div className='profile-edu bg-white p-2'>
              <h2 className='text-primary'>Education</h2>
              {profileid.education.length > 0 ? (
                <Fragment>
                  {profileid.education.map(education => (
                    <ProfileEducation
                      key={education._id}
                      education={education}
                    />
                  ))}
                </Fragment>
              ) : (
                <h4>No education credentials</h4>
              )}
            </div>
            {profileid.githubusername && (
              <ProfileGithub username={profileid.githubusername} />
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfilesById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});
export default connect(mapStateToProps, { getProfilesById })(Profile);

import React from 'react';

const TimelineCard = (props) => {
  const {
    employer,
    jobTitle,
    skills,
    content,
    align,
  } = props;

  const timelineSectionClasses = `timeline-section ${align}`
  return (
    <li className="timeline-item">
      <div className={timelineSectionClasses}>
        <div className="content-card">
          <div className="content-card-title">
            <span className="employer">{ employer }</span>
            <span className="job-title">{ jobTitle }</span>
          </div>
          <div className="content-card-skills-list">
            {
              skills.map(skill => <span>{skill}</span>)
            }
          </div>
          <ul className="content-card-description">
            { content.map(description => <li>{ description }</li>)}
          </ul>
        </div>
      </div>
    </li>
  );
};

export default TimelineCard;

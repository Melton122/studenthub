// Navigation param types for screens
export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function goBack() {
  navigationRef.current?.goBack();
}

// Screen params types
export const ScreenParams = {
  ResourceDetail: {
    resourceId: 'string',
    resource: 'object',
  },
  TutorDetail: {
    tutorId: 'string',
    tutor: 'object',
  },
  CareerDetail: {
    careerId: 'string',
    career: 'object',
  },
  UniversityDetail: {
    universityId: 'string',
    university: 'object',
  },
  NewsDetail: {
    article: 'object',
  },
  SubjectResources: {
    subjectId: 'string',
    subjectName: 'string',
  },
};
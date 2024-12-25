export const defineCampus = (peer: any) => {
  // Extract the domain from the user's email
  const emailDomain = peer.email.split('@')[1];

  // Filter the campuses where email_extension is contained within the email domain
  const matchingCampuses = peer.campus.filter((campus: any) =>
    emailDomain.includes(campus.email_extension)
  );

  // If there are matching campuses, return the last one
  if (matchingCampuses.length > 0) {
    return matchingCampuses[matchingCampuses.length - 1];
  }

  // If no matches, return the last campus from the array
  return peer.campus[peer.campus.length - 1];
};
